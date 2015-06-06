'use strict';

var primitiveSet = require('es5-ext/object/primitive-set')
  , parse        = require('querystring/decode')
  , stringify    = require('querystring/encode')
  , loadCss      = require('webmake/lib/browser/load-css')

  , ignoredContexts = primitiveSet('input', 'select', 'textarea')
  , resolveQuery, invokeResize;

resolveQuery = function (token) {
	var value;
	if (!location.search) return null;
	value = parse(location.search.slice(1))[token];
	if (value == null) return null;
	if (!value) return true;
	return Boolean(Number(value));
};

invokeResize = function () {
	var event = document.createEvent('HTMLEvents');
	event.initEvent('resize', true, true);
	window.dispatchEvent(event);
};

module.exports = function (/*options*/) {
	var options = Object(arguments[1])
	  , visible = Boolean(options.visible)
	  , key = options.key || 0x4e // 'n' key
	  , slideWidth = options.slideWidth
	  , queryToken = 'notes';

	if (options.queryToken === false) queryToken = null;
	else if (options.queryToken && (options.queryToken !== true)) queryToken = options.queryToken;

	return function (deck) {
		var update, current, resolvedQuery;

		if (queryToken) {
			resolvedQuery = resolveQuery(queryToken);
			if (resolvedQuery != null) visible = resolvedQuery;
			window.addEventListener('popstate', function () {
				update(Boolean(resolveQuery(queryToken)));
			});
		}
		if (!isNaN(slideWidth) && (slideWidth > 0)) {
			loadCss('body.notes .bespoke-slide {' +
				'width: ' + (slideWidth * 2) + 'px;' +
				'margin-left: -' + slideWidth + 'px;' +
				'}' +
				'body.notes .bespoke-slide > div.content,' +
				'body.notes .bespoke-slide > aside {' +
				'width: ' + (slideWidth - 40) + 'px;' +
				'}');
		}

		update = function (visible) {
			var query, search, url;
			if (current === visible) return;
			current = visible;
			if (visible) document.body.classList.add('notes');
			else document.body.classList.remove('notes');
			if (!queryToken) return;
			url = location.pathname;
			if (location.search) query = parse(location.search.slice(1));
			else query = {};
			if (visible) query[queryToken] = null;
			else delete query[queryToken];
			search = stringify(query);
			if (search) url += '?' + search.replace(/(?:=&)/g, '&').replace(/\=$/, '');
			if (location.hash) url += location.hash;
			history.pushState({}, '', url);
			invokeResize();
		};

		document.addEventListener('keydown', function (e) {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
			if (e.which !== key) return;
			if (ignoredContexts[e.srcElement.nodeName.toLowerCase()]) return;
			e.preventDefault();

			update(!current);
		}, false);

		update(visible);
	};
};

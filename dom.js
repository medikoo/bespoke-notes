'use strict';

var primitiveSet = require('es5-ext/object/primitive-set')
  , parse        = require('querystring2/parse')
  , stringify    = require('querystring2/stringify')
  , classes      = require('bespoke-classes')

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
	  , queryToken = 'notes';

	if (options.queryToken === false) queryToken = null;
	else if (options.queryToken && (options.queryToken !== true)) queryToken = options.queryToken;

	return function (deck) {
		var update, current, resolvedQuery;

		/* If `classes` hasn't been initialized jet, do it now */
		if (!deck.parent.classList.contains('bespoke-parent')) classes()(deck);

		if (queryToken) {
			resolvedQuery = resolveQuery(queryToken);
			if (resolvedQuery != null) visible = resolvedQuery;
			window.addEventListener('popstate', function () {
				update(Boolean(resolveQuery(queryToken)));
			});
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
			if (ignoredContexts[e.target.nodeName.toLowerCase()]) return;
			e.preventDefault();

			update(!current);
		}, false);

		update(visible);
	};
};

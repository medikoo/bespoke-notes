'use strict';

var primitiveSet = require('es5-ext/object/primitive-set')
  , parse        = require('querystring2/parse')
  , stringify    = require('querystring2/stringify')
  , addStyle     = require('dom-ext/html-document/#/add-style')
  , classes      = require('bespoke-classes')

  , ignoredContexts = primitiveSet('input', 'select', 'textarea')

  , currentZoom;

var resolveQuery = function (token) {
	var value;
	if (!location.search) return null;
	value = parse(location.search.slice(1))[token];
	if (value == null) return null;
	if (!value) return true;
	return Boolean(Number(value));
};

var invokeResize = function () {
	var event = document.createEvent('HTMLEvents');
	event.initEvent('resize', true, true);
	window.dispatchEvent(event);
};

var updateSlide = function () {
	var viewportWidth = window.innerWidth
	  , slide = document.querySelector('.bespoke-active')
	  , zoom, slideWidth, scale, transformCss;
	if (slide) {
		zoom = Number(window.getComputedStyle(slide).zoom) || 1;
		if (zoom === currentZoom) return;
		currentZoom = zoom;
		slideWidth = slide.offsetWidth * zoom;
		if (viewportWidth && slideWidth) {
			scale = ((viewportWidth / 2) / slideWidth).toFixed(3);
			transformCss = 'scale(' + scale + ') translateX(-50%)';
			addStyle.call(document, {
				'body.notes .bespoke-slide': {
					'-webkit-transform': transformCss,
					transform: transformCss
				}
			});
		}
	}
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
		setInterval(updateSlide, 200);
	};
};

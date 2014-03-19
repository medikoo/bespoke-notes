'use strict';

var parse   = require('querystring/decode')
  , loadCss = require('webmake/lib/browser/load-css');

require('./style');

module.exports = function (deck/*, options*/) {
	var options = Object(arguments[1])
	  , visible = Boolean(options.visible)
	  , key = options.key || 0x4e // 'n' key
	  , query = location.search ? parse(location.search.slice(1)) : {}
	  , slideWidth = options.slideWidth;

	if (query.notes != null) visible = !query.notes || Number(query.notes);
	if (!isNaN(slideWidth) && (slideWidth > 0)) {
		loadCss('body.notes .bespoke-slide {' +
			'width: ' + (slideWidth * 2) + 'px;' +
			'margin-left: -' + slideWidth + 'px;' +
			'}' +
			'body.notes .bespoke-slide > div.content,' +
			'body.notes .bespoke-slide > aside {' +
			'width: ' + slideWidth + 'px;' +
			'}');
	}

	document.addEventListener('keydown', function (e) {
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
		if (e.which !== key) return;
		e.preventDefault();

		document.body.classList[visible ? 'remove' : 'add']('notes');
		visible = !visible;
	}, false);

	if (visible) document.body.classList.add('notes');
};

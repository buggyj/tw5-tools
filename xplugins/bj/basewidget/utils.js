/*\
title: $:/b/modules/widget/utils.js
type: application/javascript
module-type: utils

These functions can be called before creating widgets,
ie when the name of the widget is exported, and so cannot be
included in the basewidget.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
exports.widgetapi = function (module) {
	return module.id.replace(/^(.*).js$/,"$1.api");
}

exports.widgetrename = function(module,name) {
	var api = exports.widgetapi(module);console.log(api)
	var tiddler = $tw.wiki.getTiddler(api);
	if (tiddler && $tw.utils.hop(tiddler.fields,"name")) {
		name = tiddler.fields.name;
	}
	return name;
}
})();

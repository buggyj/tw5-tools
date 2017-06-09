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

exports.getvars = function(paramString) {
	var params = [];
	if(paramString) {
		var reParam = /\s*([A-Za-z0-9\-_]+)(?:\s*:\s*(?:"""([\s\S]*?)"""|"([^"]*)"|'([^']*)'|\[\[([^\]]*)\]\]|([^"'\s]+)))?/mg,
			paramMatch = reParam.exec(paramString);
		while(paramMatch) {
			// Save the parameter details
			var paramInfo = {name: paramMatch[1]},
				defaultValue = paramMatch[2] || paramMatch[3] || paramMatch[4] || paramMatch[5] || paramMatch[6];
			if(defaultValue) {
				paramInfo["default"] = defaultValue;
			}
			params.push(paramInfo);
			// Look for the next parameter
			paramMatch = reParam.exec(paramString);
		}
	}
	return params;
}

exports.widgetdefaults = function(module) {
	var api = exports.widgetapi(module);
	var tiddler = $tw.wiki.getTiddler(api);
	if (tiddler) {
		 return tiddler.fields.parameters;
	}
	return null;
}

exports.makevars = function(module) {
	var defaultstr= exports.widgetdefaults(module);
	if (defaultstr) return exports.getvars(defaultstr);
	return [];
}

exports.widgetrename = function(module,name) {
	var api = exports.widgetapi(module);
	var tiddler = $tw.wiki.getTiddler(api);
	if (tiddler && $tw.utils.hop(tiddler.fields,"name")) {
		name = tiddler.fields.name;
	}
	return name;
}

})();

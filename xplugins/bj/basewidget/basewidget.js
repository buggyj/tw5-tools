/*\
title: $:/b/modules/widget/baswidget.js
type: application/javascript
module-type: widget

allows default param vals to be set

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var baseWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
baseWidget.prototype = new Widget();


baseWidget.prototype.getvars = function(component) {
	var paramString, 
		tid= this.wiki.getTiddler(component),
		params = [];
	if (tid) paramString = tid.fields.parameters;
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

baseWidget.prototype.setvars = function(defaults) {
	var self = this;
	$tw.utils.each(defaults,function(vari) {
		if (!!vari["default"]) self.attributes[vari.name]=vari["default"];
	});
}

baseWidget.prototype.setdefaults = function(module) {
	var defaults = this.getvars($tw.utils.widgetapi(module));
	this.setvars(defaults);
}
exports["basewidget"] = baseWidget;

})();

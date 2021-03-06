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
/*
set the defaults (they were provided in the api tid)
*/
baseWidget.prototype.initialise = function(parseTreeNode,options) {
	Widget.prototype.initialise.call(this,parseTreeNode,options);
	this.setdefaults();
}
/*
expose the widgets default parameters
*/
baseWidget.prototype.defaults = [];

baseWidget.prototype.setvars = function(defaults) {
	var self = this;
	$tw.utils.each(defaults,function(vari) {
		if (!!vari["default"]) self.attributes[vari.name]=vari["default"];
	});
}
	
baseWidget.prototype.setdefaults = function() {
	this.setvars(this.defaults);
}
exports["basewidget"] = baseWidget;

})();

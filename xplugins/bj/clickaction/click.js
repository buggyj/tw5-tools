/*\
title: $:/bj/modules/widgets/click.js
type: application/javascript
module-type: widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
var Widget, api;
try {
	Widget = require("$:/b/modules/widget/baswidget.js").basewidget;
	api = true;
} catch(e) {
	Widget = require("$:/core/modules/widgets/widget.js").widget;
	api = false;
} 
var clickWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
clickWidget.prototype = new Widget();
//clickWidget.prototype = Object.create(Widget.prototype)
/*
Render this widget into the DOM
*/
clickWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	var defaults = (api)?this.getvars($tw.utils.widgetapi(module)):[];
	this.parentDomNode = parent;
	$tw.utils.each(defaults,function(vari) {
		if (!!vari["default"]) self.attributes[vari.name]=vari["default"];
	});
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
clickWidget.prototype.execute = function() {
	this.stateTitle = this.getAttribute("state");
	this.text = this.getAttribute("text","click");
};
clickWidget.prototype.readState = function() {
	// Read the information from the state tiddler
	if(this.stateTitle) {
		var state = this.wiki.getTextReference(this.stateTitle,this["default"],this.getVariable("currentTiddler"));
		if (state === this.text) {
			this.parentDomNode.click();
		return false;	
		}

	}
};
/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
clickWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	// Completely rerender if any of our attributes have changed
	if(changedAttributes.text || changedAttributes.state) {
		this.refreshSelf();
		return true;
	} else if(this.stateTitle && changedTiddlers[this.stateTitle]) {
		this.readState();
		return true;
	}
	return false;
};

var modname = (api)?$tw.utils.widgetrename(module,"click"):"click";
exports[modname] = clickWidget;
})();

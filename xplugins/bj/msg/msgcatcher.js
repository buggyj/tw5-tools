/*\
title: $:/bj/modules/widgets/msgcatcher.js
type: application/javascript
module-type: widget

MsgCatcherWiget - root of msg action widget - 	1 

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MsgCatcherWiget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
MsgCatcherWiget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MsgCatcherWiget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
MsgCatcherWiget.prototype.execute = function() {
	// Get our parameters
    this.msg=this.getAttribute("msg");
    if (this.msg) {
		this.eventListeners = {};
		this.addEventListeners([
			{type: this.msg, handler: "handleEvent"}
		]);
	}
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
MsgCatcherWiget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["msg"] ) {
		this.refreshSelf();
		return true;
	}
	else {
		return this.refreshChildren(changedTiddlers);
	}
};

MsgCatcherWiget.prototype.handleEvent = function(event) {
	this.invokeMsgActions(event);
	return false;//always consume event
};

/*Invoke any action widgets that are immediate children of this widget
*/
MsgCatcherWiget.prototype.invokeMsgActions = function(event) {
	for(var t=0; t<this.children.length; t++) {
		var child = this.children[t];
		var params = {event:event,continue:false};
		if(child.invokeMsgAction) params = child.invokeMsgAction(params); 
	}
	if(params.continue && this.parentWidget) {
		this.parentWidget.dispatchEvent(params.event);
	}
};
exports.msgcatcher = MsgCatcherWiget;

})();

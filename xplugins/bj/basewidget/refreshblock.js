/*\
title: $:/bj/modules/widgets/refreshblock.js
type: application/javascript
module-type: widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var modname = "refreshblock";

//-------this block enables the default params values and name change --------
// *** add this var above changing to you 'default external name for the widget
//var modname = "mywidget";
/////////// ----------------- invariant block --------------------- ///////////
var Widget,api,defaults;
try {
	Widget = require("$:/b/modules/widget/baswidget.js").basewidget;
	defaults = $tw.utils.makevars(module);
	modname  = $tw.utils.widgetrename(module,modname);
} catch(e) {
	Widget = require("$:/core/modules/widgets/widget.js").widget;
	defaults = [];
} 
/////////// --------------- end invariant block ------------------ ///////////
// *** add this protoype below the definition of your version of 'thisWidget'
// *** changing the widget name to the actual name *** 

//thisWidget.prototype.defaults = defaults;
//------------------------------ end --------------------------------------

var clickWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};


/*
Inherit from the base widget class
*/
//clickWidget.prototype = new Widget();
clickWidget.prototype = Object.create(Widget.prototype)

/*
expose the widgets default parameters
*/
clickWidget.prototype.defaults = defaults;


clickWidget.prototype.refreshSelf = function() {
	var nextSibling = this.findNextSiblingDomNode();
	this.removeChildDomNodes();
	this.render(this.parentDomNode,nextSibling);
};


/*
Invoke the action widgets without refeshing first
*/
clickWidget.prototype.invokeActions = function(triggeringWidget,event) {
	var handled = false;
	// For each child widget
	for(var t=0; t<this.children.length; t++) {
		var child = this.children[t];
		// Invoke the child if it is an action widget
		if(child.invokeAction) {
			//child.refreshSelf();
			if(child.invokeAction(triggeringWidget,event)) {
				handled = true;
			}
		}
		// Propagate through through the child if it permits it
		if(child.allowActionPropagation() && child.invokeActions(triggeringWidget,event)) {
			handled = true;
		}
	}
	return handled;
};


clickWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
clickWidget.prototype.execute = function() {
	// Construct the child widgets
	this.makeChildWidgets();
};

exports[modname] = clickWidget;
})();

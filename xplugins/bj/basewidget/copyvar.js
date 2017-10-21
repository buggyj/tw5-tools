/*\
title: $:/bj/modules/widgets/copyvar.js
type: application/javascript
module-type: widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var modname = "copyvar";

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

//thisWidget.prototype = new Widget();
//------------------------------ end --------------------------------------

var copyvarWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};


/*
Inherit from the base widget class
*/
copyvarWidget.prototype = new Widget();
//copyvarWidget.prototype = Object.create(Widget.prototype)

/*
expose the widgets default parameters
*/
copyvarWidget.prototype.defaults = defaults;

/*
Render this widget into the DOM
*/

copyvarWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
copyvarWidget.prototype.execute = function() {
    this.refsh = this.getAttribute("refresh");
	this.readvar = this.getAttribute("readvar",this.getVariable("currentTiddler"));
	this.writevar = this.getAttribute("writevar",this.getVariable("currentTiddler"));
	// Construct the child widgets
	this.makeChildWidgets();
};

//copyvarWidget.prototype.refreshSelf = function() {}

copyvarWidget.prototype.invokeAction = function(triggeringWidget,event) {
	// latch the variable
	this.setVariable(this.writevar,this.getVariable(this.readvar));
	console.log ("set"+this.writevar+"as"+this.getVariable(this.readvar));
	if (this.refsh ==="yes")  this.refreshSelf();
	return true; // Action was invoked
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
copyvarWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	// Completely rerender if any of our attributes have changed
	if(changedAttributes.readvar || changedAttributes.writevar) {
		this.refreshSelf();
		return true;
	} 
    return this.refreshChildren(changedTiddlers);
};


exports[modname] = copyvarWidget;
})();

/*\
title: $:/bj/modules/widgets/click.js
type: application/javascript
module-type: widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var modname = "click";

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
clickWidget.prototype = new Widget();
//clickWidget.prototype = Object.create(Widget.prototype)

/*
expose the widgets default parameters
*/
clickWidget.prototype.defaults = defaults;

/*
Render this widget into the DOM
*/

clickWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
clickWidget.prototype.execute = function() {
	this.stateTitle = this.getAttribute("state","state");
	this.text = this.getAttribute("text","click");
    this.match=(this.getAttribute("mode","match")==="match");
	this.delay = 1*(this.getAttribute("delay","0"));
};
clickWidget.prototype.readState = function() {
var self=this;
	// Read the information from the state tiddler
	if(this.stateTitle) {
		var state = this.wiki.getTextReference(this.stateTitle,this["default"],this.getVariable("currentTiddler"));
		if (( this.match&&state === this.text)||(!this.match&&state !== this.text)) {
			if (this.delay == 0) this.parentDomNode.click();
            else setTimeout(function(){self.parentDomNode.click();},this.delay);
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


exports[modname] = clickWidget;
exports["bj/"+modname] = clickWidget;
})();

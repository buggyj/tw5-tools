/*\
title: $:/bj/modules/widgets/action-deletetiddler.js
type: application/javascript
module-type: widget

Action widget to delete a tiddler.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var DeleteTiddlerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
DeleteTiddlerWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
DeleteTiddlerWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
DeleteTiddlerWidget.prototype.execute = function() {
	this.actionFilter = this.getAttribute("$filter");
	this.actionTiddler = this.getAttribute("$tiddler");
	this.subTiddler = this.getAttribute("$subtiddler");
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
DeleteTiddlerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["$filter"] || changedAttributes["$tiddler"] || changedAttributes["$tsubiddler"]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
DeleteTiddlerWidget.prototype.invokeAction = function(triggeringWidget,event) {

	if(this.subTiddler) {
		this.deletesubtiddler();
	}
	else {
		this.deletetiddler();
	}
	return true; // Action was invoked
};

DeleteTiddlerWidget.prototype.deletetiddler = function() {
	var tiddlers = [];
	if(this.actionFilter) {
		tiddlers = this.wiki.filterTiddlers(this.actionFilter,this);
	}
	if(this.actionTiddler) {
		tiddlers.push(this.actionTiddler);
	}
	for(var t=0; t<tiddlers.length; t++) {
		this.wiki.deleteTiddler(tiddlers[t]);
	}
	return true; // Action was invoked
};

DeleteTiddlerWidget.prototype.deletesubtiddler = function() {
	if(this.subTiddler) {
		var container = this.wiki.getTiddler(this.actionTiddler),
			text = JSON.parse(container.fields.text),
			updateFields;

		delete text.tiddlers[this.subTiddler];

		updateFields = {
			title: this.actionTiddler,
			text: JSON.stringify(text)
		};	
		this.wiki.addTiddler(new $tw.Tiddler(this.wiki.getCreationFields(),container,updateFields,this.wiki.getModificationFields()));				
	} else {
		updatesimple(value);
	}
}

exports["bj-action-deletetiddler"] = DeleteTiddlerWidget;

})();



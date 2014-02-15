/*\
title: $:/core/modules/widgets/dropzone-extend.js
type: application/javascript
module-type: widget

Extend the dropzone widget to allow other widget to handle drop events 

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.browser) {
    require("$:/plugins/tiddlywiki/codemirror/codemirror.js");
}

var DropZoneWidget = require("$:/core/modules/widgets/dropzone.js")["dropzone"];

/*
The edit-text widget calls this method just after inserting its dom nodes
*/
/*
overload the base widget class initialise
*/
DropZoneWidget.prototype.initialise = function(parseTreeNode,options) {
	Widget.prototype.initialise.call(this,parseTreeNode,options);
	this.addEventListeners([
		{type: "tw-dropHandled", handler: "handleDropHandled"}]);
};
/*
handle drophandled message
*/
DropZoneWidget.prototype.handleDropHandled = function(event) {
	// Reset the enter count
	this.dragEnterCount = 0;
	// Remove highlighting
	$tw.utils.removeClass(this.domNodes[0],"tw-dragover");
	return false;
};
})();

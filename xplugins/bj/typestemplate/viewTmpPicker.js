/*\
title: $:/plugins/bj/typestemplate/viewTmpPicker.js
type: application/javascript
module-type: widget



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Mappings from content type to edit templates type are stored in tiddlers with this prefix
var VIEW_TEMPLATE_MAPPING_PREFIX = "$:/config/ViewTemplateTypeMappings/";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var viewTmpPicker = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
viewTmpPicker.prototype = new Widget();

/*
Render this widget into the DOM
*/
viewTmpPicker.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};


viewTmpPicker.prototype.makeTemplate = function(title) {
	var templateTree = [{type: "transclude", attributes: {tiddler: {type: "string", value: title}}}];
	return {type: "listitem", itemTitle: title, variableName: this.variableName, children: templateTree};
}

viewTmpPicker.prototype.getTemplate = function() {
	var cur = this.getVariable("currentTiddler"), template = null, 
	tiddler = this.wiki.getTiddler(cur);
	tiddler && tiddler.fields && tiddler.fields.applicationtype?
		template =  VIEW_TEMPLATE_MAPPING_PREFIX +tiddler.fields.applicationtype :
		tiddler && tiddler.fields && tiddler.fields.type? 
				template =  VIEW_TEMPLATE_MAPPING_PREFIX +tiddler.fields.type : template = null;
	if (!template)
		return  "$:/core/ui/ViewTemplate";
	template = $tw.wiki.getTiddlerText(template.trim());
	if (template) { return template.trim();}
return  "$:/core/ui/ViewTemplate";
}
/*
Compute the internal state of the widget
*/
viewTmpPicker.prototype.execute = function() {
	var members = [],
		self = this;
	this.template = self.getTemplate();
	members.push(self.makeTemplate(this.template));
	// Construct the child widgets
	this.makeChildWidgets(members);
};


/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
viewTmpPicker.prototype.refresh = function(changedTiddlers) {
//refresh when template edited handled by child transclusion
return this.refreshChildren(changedTiddlers);
};
	


exports["viewTemplatePicker"] = viewTmpPicker;

})();

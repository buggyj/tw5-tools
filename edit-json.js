/*\
title: $:/plugins/bj/jsoneditor/edit-json.js
type: application/javascript
module-type: widget

jsoneditor adaptor

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var MIN_TEXT_AREA_HEIGHT = 100; // Minimum height of textareas in pixels

var Widget = require("$:/core/modules/widgets/widget.js").widget;
var newid=0;
var EditJsonWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};
if($tw.browser) {
	require("$:/plugins/bj/jsoneditor/JSONeditor.js");
}
/*
Inherit from the base widget class
*/
EditJsonWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
EditJsonWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Create our element
	var editInfo = this.getEditInfo();
	var domNode = this.document.createElement("div");
	if(this.editType) {
		domNode.setAttribute("type",this.editType);
	}
	if(editInfo.value === "" && this.editPlaceholder) {
		domNode.setAttribute("placeholder",this.editPlaceholder);
	}
	// Assign classes
	if(this.editClass) {
		domNode.className = this.editClass;
	}

	domNode.innerHTML = '<span><div style="font-size: 11px; font-family: Verdana,Arial,Helvetica,sans-serif;" id="jsoneditortree'+newid+'"></div>'+
						'<div style="font-size: 11px; font-family: Verdana,Arial,Helvetica,sans-serif;" id="jsoneditorform'+newid+'"></div></span>';
	// Add an input event handler
	//$tw.utils.addEventListeners(domNode,[
	//	{name: "focus", handlerObject: this, handlerMethod: "handleFocusEvent"},
	//	{name: "input", handlerObject: this, handlerMethod: "handleInputEvent"}
	//]);
	// Insert the element into the DOM
	parent.insertBefore(domNode,nextSibling);
	this.instance=JSONeditor.start('jsoneditortree'+newid,'jsoneditorform'+newid,JSON.parse(editInfo.value),false);
	newid++;
	this.domNodes.push(domNode);
	if(this.postRender) {
		this.postRender();
	}
	this.instance.forSaving=function(){
		self.saveChanges(JSON.stringify(this.json));
	}

};

/*
Get the tiddler being edited and current value
*/
EditJsonWidget.prototype.getEditInfo = function() {
	// Get the edit value
	var self = this,
		value,
		update;
	if(this.editIndex) {
		value = this.wiki.extractTiddlerDataItem(this.editTitle,this.editIndex,this.editDefault);
		update = function(value) {
			var data = self.wiki.getTiddlerData(self.editTitle,{});
			if(data[self.editIndex] !== value) {
				data[self.editIndex] = value;
				self.wiki.setTiddlerData(self.editTitle,data);
			}
		};
	} else {
		// Get the current tiddler and the field name
		var tiddler = this.wiki.getTiddler(this.editTitle);
		if(tiddler) {
			// If we've got a tiddler, the value to display is the field string value
			value = tiddler.getFieldString(this.editField);
		} else {
			// Otherwise, we need to construct a default value for the editor
			value = '{}';
		}

		update = function(value) {
			var tiddler = self.wiki.getTiddler(self.editTitle),
				updateFields = {
					title: self.editTitle
				};
			updateFields[self.editField] = value;
			self.wiki.addTiddler(new $tw.Tiddler(self.wiki.getCreationFields(),tiddler,updateFields,self.wiki.getModificationFields()));
		};
	}
	return {value: value, update: update};
};

/*
Compute the internal state of the widget
*/
EditJsonWidget.prototype.execute = function() {
	// Get our parameters
	this.editTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	this.editField = this.getAttribute("field","text");
	this.editIndex = this.getAttribute("index");
	this.editClass = this.getAttribute("class");
	this.editPlaceholder = this.getAttribute("placeholder");
	this.editFocusPopup = this.getAttribute("focusPopup");
	// Get the editor element tag and type
	var tag,type;
	if(this.editField === "text") {
		tag = "textarea";
	} else {
		tag = "input";
		var fieldModule = $tw.Tiddler.fieldModules[this.editField];
		if(fieldModule && fieldModule.editTag) {
			tag = fieldModule.editTag;
		}
		if(fieldModule && fieldModule.editType) {
			type = fieldModule.editType;
		}
		type = type || "text";
	}
	// Get the rest of our parameters
	this.editTag = this.getAttribute("tag",tag);
	this.editType = this.getAttribute("type",type);
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
EditJsonWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	// Completely rerender if any of our attributes have changed
	if(changedAttributes.tiddler || changedAttributes.field || changedAttributes.index) {
		this.refreshSelf();
		return true;
	} else if(changedTiddlers[this.editTitle]) {
		//this.refreshSelf();//BJ FIXME saving cause the widget to get redrawn
		return true;
	}
	return false;
};


/*
Handle a dom "input" event
*/
EditJsonWidget.prototype.handleInputEvent = function(event) {
	this.saveChanges(this.domNodes[0].value);
	this.fixHeight();
	return true;
};

EditJsonWidget.prototype.handleFocusEvent = function(event) {
	if(this.editFocusPopup) {
		$tw.popup.triggerPopup({
			domNode: this.domNodes[0],
			title: this.editFocusPopup,
			wiki: this.wiki,
			force: true
		});
	}
	return true;
};

EditJsonWidget.prototype.saveChanges = function(text) {
	var editInfo = this.getEditInfo();
	if(text !== editInfo.value) {
		editInfo.update(text);
	}
};

exports["edit-json"] = EditJsonWidget;

})();

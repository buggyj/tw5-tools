/*\
title: $:/plugins/BJ/TW5CKEditor/ckedit.js
type: application/javascript
module-type: widget

ckeditor adaptor

\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.browser) {
	require("$:/plugins/tiddlywiki/ckeditor/ckeditor.js");
	var dom=require("$:/core/modules/utils/dom.js");
 
	dom.applyStyleSheet("ckeditmain",$tw.wiki.getTiddlerText("$:/plugins/tiddlywiki/ckeditor/skins/moonodiv/editor.css"));
	dom.applyStyleSheet("ckeditdialog",$tw.wiki.getTiddlerText("$:/plugins/tiddlywiki/ckeditor/skins/moonodiv/dialog.css"));
	if (typeof CKEDITOR != 'undefined')   {
	CKEDITOR.stylesSet.add( 'default',$tw.wiki.getTiddlerData("$:/plugins/tiddlywiki/ckeditor/styles.json"));
	//BJ FixMe: figure out how to hide tw5 tags and macros from ckeditor
		CKEDITOR.config.protectedSource.push(/<\/?\$[^<]*\/?>/g);
		//CKEDITOR. config.protectedSource.push(/<\?[\s\S]*?\?>/g); // PHP Code
		CKEDITOR.config.protectedSource.push(/<code>[\s\S]*?<\/code>/gi); // Code tags
		CKEDITOR.config.entities = false;
		CKEDITOR.config.extraPlugins = $tw.wiki.getTiddlerText("$:/plugins/tiddlywiki/ckeditor/extraplugins");
		var workfn= function(tiddler,title) {
			var head_ext=title.split(".");
				if (head_ext[1]==='png'){
						var head = head_ext[0];//hack off .png
						var headlist = head.split("/"); //filename is last
						if (headlist[3] ==='ckeditor') {
							var iconname = headlist[headlist.length-1];
							//alert("icon"+iconname);
							CKEDITOR.skin.icons[ iconname ] = { path: '); background-image: url(data:image/png;base64,'+
							   $tw.wiki.getTiddlerText(title)+');', offset: 0 } ;
						}
				}else if (head_ext[1]==='js'){
						var head = head_ext[0];//hack of .png
						var headlist = head.split("/"); //filename is last
						if (headlist[3] ==='ckeditor') {require(title);  }
				}
		}
		$tw.utils.each($tw.wiki.shadowTiddlers,workfn);

		//for non shadow tiddlers 
		var extensions =  $tw.wiki.getTiddlersWithTag("CKExtension");
		for (var i = 0; i<extensions.length;i++) {workfn(null,extensions[i])};
	}
}

})();

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var MIN_TEXT_AREA_HEIGHT = 100; // Minimum height of textareas in pixels

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var EditHtmlWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
EditHtmlWidget.prototype = new Widget();

EditHtmlWidget.prototype.postRender = function() {
	var self = this,
		cm;
	if($tw.browser && window.CKEDITOR && this.editTag === "textarea") {
		
		var ck ="editor"+ Math.random();
		this.domNodes[0].setAttribute("name",ck);
		this.domNodes[0].setAttribute("id",ck);

		CKEDITOR.replace(ck, { customConfig:"" ,
			extraPlugins:$tw.wiki.getTiddlerText("$:/plugins/tiddlywiki/ckeditor/extraplugins")});	
		//BJ: note that we have statically loaded the style sheet already,
		//therefore it is not possible to load a different skin here
		//CKEDITOR.replace(ck,{ extraPlugins : 'divarea'})
		CKEDITOR.instances[ck].on('change', 
			function() {
				self.getEditInfo().update(CKEDITOR.instances[ck].getData());
			}
		);
	} 
};
/*
BJ the follow code is fro tw5 core, with some minor modifications
*******************************************************************
Edit-html widget
*/
/*
Render this widget into the DOM
*/
EditHtmlWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Create our element
	var domNode = this.document.createElement(this.editTag);
	if(this.editType) {
		domNode.setAttribute("type",this.editType);
	}
	if(this.editPlaceholder) {
		domNode.setAttribute("placeholder",this.editPlaceholder);
	}
	// Assign classes
	if(this.editClass) {
		domNode.className = this.editClass;
	}
	// Set the text
	var editInfo = this.getEditInfo();
	if(this.editTag === "textarea") {
		domNode.appendChild(this.document.createTextNode(editInfo.value));
	} else {
		domNode.setAttribute("value",editInfo.value)
	}

	// Insert the element into the DOM
	parent.insertBefore(domNode,nextSibling);
	this.domNodes.push(domNode);
	if(this.postRender) {
		this.postRender();
	}
	// Fix height
	this.fixHeight();
};

/*
Get the tiddler being edited and current value
*/
EditHtmlWidget.prototype.getEditInfo = function() {
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
			switch(this.editField) {
				case "text":
					value = "Type the text for the tiddler '" + this.editTitle + "'";
					break;
				case "title":
					value = this.editTitle;
					break;
				default:
					value = "";
					break;
			}
			if(this.editDefault !== undefined) {
				value = this.editDefault;
			}
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
EditHtmlWidget.prototype.execute = function() {
	// Get our parameters
	this.editTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	this.editField = this.getAttribute("field","text");
	this.editIndex = this.getAttribute("index");
	this.editDefault = this.getAttribute("default");
	this.editClass = this.getAttribute("class");
	this.editPlaceholder = this.getAttribute("placeholder");
	this.editFocusPopup = this.getAttribute("focusPopup");
	this.onkeyupdate = this.getAttribute("onkeyupdate","yes"); 
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
EditHtmlWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	// Completely rerender if any of our attributes have changed
	if(changedAttributes.tiddler || changedAttributes.field || changedAttributes.index) {
		this.refreshSelf();
		return true;
	} else if(changedTiddlers[this.editTitle]) {
		this.updateEditor(this.getEditInfo().value);
		return true;
	}
	return false;
};

/*
Update the editor with new text. This method is separate from updateEditorDomNode()
so that subclasses can override updateEditor() and still use updateEditorDomNode()
*/
EditHtmlWidget.prototype.updateEditor = function(text) {
	this.updateEditorDomNode(text);
};

/*
Update the editor dom node with new text
*/
EditHtmlWidget.prototype.updateEditorDomNode = function(text) {
	// Replace the edit value if the tiddler we're editing has changed
	var domNode = this.domNodes[0];
	if(!domNode.isTiddlyWikiFakeDom) {
		if(this.document.activeElement !== domNode) {
			domNode.value = text;
		}
		// Fix the height if needed
		this.fixHeight();
	}
};

/*
Fix the height of textareas to fit their content
*/
EditHtmlWidget.prototype.fixHeight = function() {
	var self = this,
		domNode = this.domNodes[0];
	if(domNode && !domNode.isTiddlyWikiFakeDom && this.editTag === "textarea") {
		$tw.utils.nextTick(function() {
			// Resize the textarea to fit its content, preserving scroll position
			var scrollPosition = $tw.utils.getScrollPosition(),
				scrollTop = scrollPosition.y;
			// Set its height to auto so that it snaps to the correct height
			domNode.style.height = "auto";
			// Calculate the revised height
			var newHeight = Math.max(domNode.scrollHeight + domNode.offsetHeight - domNode.clientHeight,MIN_TEXT_AREA_HEIGHT);
			// Only try to change the height if it has changed
			if(newHeight !== domNode.offsetHeight) {
				domNode.style.height =  newHeight + "px";
				// Make sure that the dimensions of the textarea are recalculated
				$tw.utils.forceLayout(domNode);
				// Check that the scroll position is still visible before trying to scroll back to it
				scrollTop = Math.min(scrollTop,self.document.body.scrollHeight - window.innerHeight);
				window.scrollTo(scrollPosition.x,scrollTop);
			}
		});
	}
};

/*
Handle a dom "input" event
*/
EditHtmlWidget.prototype.handleInputEvent = function(event) {
	this.saveChanges(this.domNodes[0].value);
	this.fixHeight();
	return true;
};

EditHtmlWidget.prototype.handleFocusEvent = function(event) {
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

EditHtmlWidget.prototype.saveChanges = function(text) {
	var editInfo = this.getEditInfo();
	if(text !== editInfo.value) {
		editInfo.update(text);
	}
};

exports["edit-html"] = EditHtmlWidget;

})();


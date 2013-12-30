/*\
title: $:/core/modules/widgets/edit-html.js
type: application/javascript
module-type: widget

Edit-html widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.browser) {
	//document.write('<script src="ckeditor.js"></script>');
require("$:/plugins/tiddlywiki/ckeditor/ckeditor.js");

       //require("$:/plugins/tiddlywiki/ckeditor/lang/en.js");   
        //require("$:/plugins/tiddlywiki/ckeditor/plugins/about/dialogs/about.js");  
 
    if (typeof CKEDITOR != 'undefined')   {
//CKEDITOR.config.entities = false;
//CKEDITOR.config.htmlEncodeOutput = false;
CKEDITOR.stylesSet.add( 'default', [
    // Block Styles
    { name: 'Blue Title',       element: 'h3',      styles: { 'color': 'Blue' } },
    { name: 'Red Title',        element: 'h3',      styles: { 'color': 'Red' } },

    // Inline Styles
    { name: 'Marker: Yellow',   element: 'span',    styles: { 'background-color': 'Yellow'} },
    { name: 'Marker: Green',    element: 'span',    styles: { 'background-color': 'Lime' } },

    // Object Styles
    {
        name: 'Image on Left',
        element: 'img',
        attributes: {
            style: 'padding: 5px; margin-right: 5px',
            border: '2',
            align: 'left'
        }
    }


] );
 var loadCSS= function (filename){ 

       var file = document.createElement("link")
       file.setAttribute("rel", "stylesheet")
       file.setAttribute("type", "text/css")
       file.setAttribute("href", filename)

       if (typeof file !== "undefined")
          document.getElementsByTagName("head")[0].appendChild(file)
    }


   //just call a function to load a new CSS:
   //alert(escape("$:/plugins/tiddlywiki/ckeditor/skins/karma/editor.css") );
   loadCSS( 'data:text/css,'+
					   escape( $tw.wiki.getTiddlerText("$:/plugins/tiddlywiki/ckeditor/skins/moonodiv/editor.css")) );
	 loadCSS( 'data:text/css,'+
					   escape( $tw.wiki.getTiddlerText("$:/plugins/tiddlywiki/ckeditor/skins/moonodiv/dialog.css")) );
CKEDITOR.config.protectedSource.push(/<\/?\$[^<]*\/?>/g);
//CKEDITOR. config.protectedSource.push(/<\?[\s\S]*?\?>/g); // PHP Code
 CKEDITOR.config.protectedSource.push(/<code>[\s\S]*?<\/code>/gi); // Code tags
(function() {
	/*for non shadow tiddlers - maybe user drags some new plugins for ckeditor, use
	extensions =  $tw.wiki.getTiddlersWithTag("CKEditorExtension");
	for i to 1 to extensions.length do....
	*/
	var workfn= function(tiddler,title) {
		var head_ext=title.split(".");
			if (head_ext[1]==='png'){
					var head = head_ext[0];//hack of .png
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
					if (headlist[3] ==='ckeditor') require(title);  
			}
	}

	$tw.utils.each($tw.wiki.shadowTiddlers,workfn);
	/*for non shadow tiddlers - maybe user drags some new plugins for ckeditor, use
	extensions =  $tw.wiki.getTiddlersWithTag("CKEditorExtension");
	for i to 1 to extensions.length do workfn
	*/
})();
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
			
			//CKEDITOR.replace(ck,{skin : 'moono', customConfig:'' });
			CKEDITOR.replace(ck, { customConfig:"" }	);	
			//CKEDITOR.replace(ck,{skin : 'moono'});
						//CKEDITOR.replace(ck,{ extraPlugins : 'divarea'})
			//CKEDITOR.replace(ck,{ extraPlugins : 'divarea', skin : 'moonodiv'})
			CKEDITOR.instances[ck].on('change', 
				function() {
					//alert('text changed!'+CKEDITOR.instances[ck].getData());
					self.getEditInfo().update(CKEDITOR.instances[ck].getData());
				}
			);

	
		} 
};
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


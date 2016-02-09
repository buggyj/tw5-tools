/*\
title: $:/plugins/bj/visualeditor/ckedit.js
type: application/javascript
module-type: widget

ckeditor adaptor

\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
var hasClass=function (e,theClass)
{
	if(e.getAttribute('class')) {
		if(e.getAttribute('class').split(" ").indexOf(theClass) != -1)
			return true;
	}
	return false;
}
var applyStyleSheet = function(id,css) {
	var el = document.getElementById(id);
	if(document.createStyleSheet) { // Older versions of IE
		if(el) {
			el.parentNode.removeChild(el);
		}
		document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeEnd",
			'&nbsp;<style id="' + id + '" type="text/css">' + css + '</style>'); // fails without &nbsp;
	} else { // Modern browsers
		if(el) {
			el.replaceChild(document.createTextNode(css), el.firstChild);
		} else {
			el = document.createElement("style");
			el.type = "text/css";
			el.id = id;
			el.appendChild(document.createTextNode(css));
			document.getElementsByTagName("head")[0].appendChild(el);
		}
	}
};
if($tw.browser) {
	//require("$:/plugins/bj/visualeditor/ckeditor.js");
	if (typeof CKEDITOR != 'undefined')   {
		var PLUSMODE  = (typeof $tw.wiki.getTiddler("$:/language/Docs/Types/text/x-perimental")!='undefined');

		var sty;

		try {
		 sty=$tw.wiki.getTiddlerData("$:/plugins/bj/visualeditor/styles.json");
		} catch(e){ 
			alert("invalid style format");
			sty=[];
		}
		if (PLUSMODE) sty.push({ "name": "verbatim","element": "span","attributes": {"class": "verbatim"}});

		CKEDITOR.stylesSet.add( 'default',sty);
		if (PLUSMODE) CKEDITOR.addCss($tw.wiki.getTiddlerData("$:/plugins/bj/visualeditor/verbatim.json").verbatim);
		CKEDITOR.on( 'instanceReady', function( ev ) {
			var blockTags = ['div','h1','h2','h3','h4','h5','h6','p','pre','li','blockquote','ul','ol',
	  'table','thead','tbody','tfoot','td','th',];
			var rules = {
			indent : false,
			breakBeforeOpen : true,
			breakAfterOpen : false,
			breakBeforeClose : false,
			breakAfterClose : false
		};

		for (var i=0; i<blockTags.length; i++) {
		ev.editor.dataProcessor.writer.setRules( blockTags[i], rules );
		}


		});

		//BJ FixMe: figure out how to hide tw5 tags and macros from ckeditor
		CKEDITOR.config.protectedSource.push(/<\/?\$[^<]*\/?>/g);
		CKEDITOR.config.protectedSource.push(/<<[^<]*>>/g);
		//CKEDITOR. config.protectedSource.push(/<\?[\s\S]*?\?>/g); // PHP Code
		CKEDITOR.config.protectedSource.push(/<code>[\s\S]*?<\/code>/gi); // Code tags
		CKEDITOR.config.entities = false;
	}

	var atiddler = $tw.wiki.getTiddler("$:/config/EditorTypeMappings/text/html");
	if (atiddler==undefined) {
				$tw.wiki.addTiddler(new $tw.Tiddler($tw.wiki.getCreationFields(),
				{title:"$:/config/EditorTypeMappings/text/html", text:"html"}));
	}
	atiddler = $tw.wiki.getTiddler("$:/config/EditorTypeMappings/text/x-perimental");
	if (atiddler==undefined) {	
				$tw.wiki.addTiddler(new $tw.Tiddler($tw.wiki.getCreationFields(),
					{title:"$:/config/EditorTypeMappings/text/x-perimental", text:"x-perimental"}));
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
var PLUSMODE  = (typeof $tw.wiki.getTiddler("$:/language/Docs/Types/text/x-perimental")!='undefined');

/*
Inherit from the base widget class
*/
EditHtmlWidget.prototype = new Widget();

EditHtmlWidget.prototype.postRender = function() {
	var self = this,
		cm;
	var toWiki = function(text) {
		//if($tw.browser) alert("in towiki "+text)

		//BJ FIXME - in theory the attribs can be in any order, so this may fail as it is
		var newtext="";

		 newtext=text.replace(/^<p><span class=\"verbatim\".*?>([^<]*)<\/span><\/p>/,
		function(m,key,offset,str){
                if (key.indexOf('<')!=-1) {// we have caputure some formatting - !abort
					return m;
				}
				return $tw.utils.htmlDecode(key)+"\n<!-- verbatim -->";

		});
		newtext =
		newtext.replace(/<p><span class=\"verbatim\".*?>([^<]*)<\/span><\/p>/g,
		function(m,key,offset,str){
                if (key.indexOf('<')!=-1) {// we have caputure some formatting - !abort
					return m;
				}
				return "\n<!-- nl verb -->"+$tw.utils.htmlDecode(key)+"<!-- atim -->";

			
		});
		newtext =
		newtext.replace(/<span class=\"verbatim\".*?>([^<]*)<\/span>/g,
		function(m,key,offset,str){
                if (key.indexOf('<')!=-1) {// we have caputure some formatting - !abort
					return m;
				}
				return "<!-- verb -->"+$tw.utils.htmlDecode(key)+"<!-- atim -->";
		});
		//if($tw.browser) alert(newtext);
		return newtext;
	}

	if($tw.browser && window.CKEDITOR && this.editTag === "textarea") {
		
		var ck ="editor"+ Math.random();
		this.domNodes[0].firstChild.setAttribute("name",ck);
		this.domNodes[0].firstChild.setAttribute("id",ck);
		var config;
		try {
		    config= $tw.wiki.getTiddlerData("$:/plugins/bj/visualeditor/config.json");
		} catch(e) {
			alert("invalid config format");
			config = [];
		}
		CKEDITOR.replace(ck, config);//,
			//extraPlugins:$tw.wiki.getTiddlerText("$:/plugins/bj/visualeditor/extraplugins.tid")});	
		//BJ: note that we have statically loaded the style sheet already,
		//therefore it is not possible to load a different skin here
		//CKEDITOR.replace(ck,{ extraPlugins : 'divarea'})

		CKEDITOR.instances[ck].on('change', 
			function() { 
				if (PLUSMODE && self.edittype == 'text/x-perimental') {
					self.saveChanges(toWiki(CKEDITOR.instances[ck].getData()));
				} else {
					self.saveChanges(CKEDITOR.instances[ck].getData());
				} 
			}
		);
	} 
};
/*
BJ the follow code is from tw5 core, with some minor modifications
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
	var fromWiki = function(text) {
		var preAmble='<span class="verbatim">';
		var index=1;
		//seperate the /define .../end section
		text = text.split("<\!-- verbatim -->");
		if (text.length==1) //no preamble defined
			index=0;
		else
			text[0]= preAmble+$tw.utils.htmlEncode(text[0])+'</span>'
		text[index] = 	text[index].replace(/^<\!-- nl verb -->([\s\S]*?)<\!-- atim -->/mg,
		function(m,key,offset,str){//alert(key);
			return '<p>'+preAmble+$tw.utils.htmlEncode(key)+'</span>'+'</p>';
		});//alert ("newtext "+text[index]);
		text[index] = 	text[index].replace(/<\!-- verb -->([\s\S]*?)<\!-- atim -->/g,
		function(m,key,offset,str){//alert(key);
			return preAmble+$tw.utils.htmlEncode(key)+'</span>';
		});
		//alert ("newtext "+text.join(""));
		return text.join("");
	}
	// Create our element
	var outerDomNode = this.document.createElement('div');
		outerDomNode.className = "tw-ckeditor-instance";
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
		if (PLUSMODE && this.edittype == 'text/x-perimental') {
			domNode.appendChild(this.document.createTextNode(fromWiki(editInfo.value)));
		} else  {
			domNode.appendChild(this.document.createTextNode(editInfo.value));
		} 
	} else {
		domNode.setAttribute("value",editInfo.value)
	}
    outerDomNode.appendChild(domNode);
	// Insert the element into the DOM
	parent.insertBefore(outerDomNode,nextSibling);
	this.domNodes.push(outerDomNode);
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
		// Get the content type of the thing we're editing
	this.edittype;
	if(this.editField === "text") {
		var tiddler = this.wiki.getTiddler(this.editTitle);
		if(tiddler) {
			this.edittype = tiddler.fields.type;
		}
	}
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
	var domNode = this.domNodes[0].firstChild;
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
	this.saveChanges(this.domNodes[0].firstChild.value);
	this.fixHeight();
	return true;
};

EditHtmlWidget.prototype.handleFocusEvent = function(event) {
	if(this.editFocusPopup) {
		$tw.popup.triggerPopup({
			domNode: this.domNodes[0].firstChild,
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
$tw.utils.registerFileType("text/x-perimental","utf8",".perimental");
exports["edit-x-perimental"] = EditHtmlWidget;

})();


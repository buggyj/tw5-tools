/*\
title: $:/bj/modules/macros/getfield.js
type: application/javascript
module-type: macro
tags: $:/tags/tiddlyclip 

View widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "getfield";

exports.params = [
	{name: "tiddler"},{name: "subtiddler"},{name: "field"},{name: "index"},{name: "format"},{name: "template"}
];

exports.run = function(tiddler,subtiddler,field,index,format,template) {
/*
Inherit from the base widget class
*/
	var parent = this;
	var ViewWidget = function() {
		this.initialise();
	};
	ViewWidget.prototype =  {};
	


/*
Compute the internal state of the widget
*/
ViewWidget.prototype.make = function(x) {
	// allow indirection of variable - <varible-name>
	if (!x) return x; //null str
	var reParam = /<([^>\s]+)>/mg,
		paramMatch = reParam.exec(x);
		
	if (paramMatch) {
		return parent.getVariable(paramMatch[1]);
	}
	else {
		return x;
	}
}

ViewWidget.prototype.getTidName = function() {
	var transclusion = parent.getVariable("transclusion");	
	if (transclusion) {
		return transclusion.split('|')[1];
	}
	else {
		return "";
	}
}

ViewWidget.prototype.getSubtidName = function() {
	var transclusion = parent.getVariable("transclusion");
	var reParam = /\{([^\}\s]+)\}/mg,
		paramMatch = reParam.exec(transclusion);
		
	if (paramMatch) {
		return paramMatch[1].split('|')[4];
	}
	else {
		return "";
	}
}

ViewWidget.prototype.initialise = function() {
	this.wiki = $tw.wiki;
	// Get parameters from our attributes
	this.viewTitle = this.make(tiddler||"<currentTiddler>");
	this.viewSubtiddler = this.make(subtiddler);
	if (this.viewTitle === "$") { 
		this.viewTitle = this.getTidName();
		if (this.viewSubtiddler === "$") {
			this.viewSubtiddler = this.getSubtidName();
		}
		this.viewField = this.make(field||"title");
	}
	else if (this.getTidName() == tiddler) {
		//current tiddler cannot default to text without recursion problem
		this.viewField = this.make(field||"title");
	}
	else this.viewField = this.make(field||"text");
	
	this.viewIndex = this.make(index);
	this.viewFormat = format||"text";
	this.viewTemplate = template||"";
	switch(this.viewFormat) {
		case "htmlwikified":
			this.text = this.getValueAsHtmlWikified();
			break;
		case "htmlencodedplainwikified":
			this.text = this.getValueAsHtmlEncodedPlainWikified();
			break;
		case "htmlencoded":
			this.text = this.getValueAsHtmlEncoded();
			break;
		case "urlencoded":
			this.text = this.getValueAsUrlEncoded();
			break;
		case "doubleurlencoded":
			this.text = this.getValueAsDoubleUrlEncoded();
			break;
		case "date":
			this.text = this.getValueAsDate(this.viewTemplate);
			break;
		case "relativedate":
			this.text = this.getValueAsRelativeDate();
			break;
		case "stripcomments":
			this.text = this.getValueAsStrippedComments();
			break;
		case "jsencoded":
			this.text = this.getValueAsJsEncoded();
			break;
		default: // "text"
			this.text = this.getValueAsText();
			break;
	}
};

/*
The various formatter functions are baked into this widget for the moment. Eventually they will be replaced by macro functions
*/

/*
Retrieve the value of the widget. Options are:
asString: Optionally return the value as a string
*/
ViewWidget.prototype.getValue = function(options) {
	options = options || {};
	var value = options.asString ? "" : undefined;
	if(this.viewIndex) {
		value = this.wiki.extractTiddlerDataItem(this.viewTitle,this.viewIndex);
	} else {
		var tiddler;
		if(this.viewSubtiddler) {
			tiddler = this.wiki.getSubTiddler(this.viewTitle,this.viewSubtiddler);	
		} else {
			tiddler = this.wiki.getTiddler(this.viewTitle);
		}
		if(tiddler) {
			if(this.viewField === "text" && !this.viewSubtiddler) {
				// Calling getTiddlerText() triggers lazy loading of skinny tiddlers
				value = this.wiki.getTiddlerText(this.viewTitle);
			} else {
				if($tw.utils.hop(tiddler.fields,this.viewField)) {
					if(options.asString) {
						value = tiddler.getFieldString(this.viewField);
					} else {
						value = tiddler.fields[this.viewField];				
					}
				}
			}
		} else {
			if(this.viewField === "title") {
				value = this.viewTitle;
			}
		}
	}
	return value;
};

ViewWidget.prototype.getf = function() {
	return this.text;
};
ViewWidget.prototype.getValueAsText = function() {
	return this.getValue({asString: true});
};

ViewWidget.prototype.getValueAsHtmlWikified = function() {
	return this.wiki.renderText("text/html","text/vnd.tiddlywiki",this.getValueAsText(),{parentWidget: this});
};

ViewWidget.prototype.getValueAsHtmlEncodedPlainWikified = function() {
	return $tw.utils.htmlEncode(this.wiki.renderText("text/plain","text/vnd.tiddlywiki",this.getValueAsText(),{parentWidget: this}));
};

ViewWidget.prototype.getValueAsHtmlEncoded = function() {
	return $tw.utils.htmlEncode(this.getValueAsText());
};

ViewWidget.prototype.getValueAsUrlEncoded = function() {
	return encodeURIComponent(this.getValueAsText());
};

ViewWidget.prototype.getValueAsDoubleUrlEncoded = function() {
	return encodeURIComponent(encodeURIComponent(this.getValueAsText()));
};

ViewWidget.prototype.getValueAsDate = function(format) {
	format = format || "YYYY MM DD 0hh:0mm";
	var value = $tw.utils.parseDate(this.getValue());
	if(value && $tw.utils.isDate(value) && value.toString() !== "Invalid Date") {
		return $tw.utils.formatDateString(value,format);
	} else {
		return "";
	}
};

ViewWidget.prototype.getValueAsRelativeDate = function(format) {
	var value = $tw.utils.parseDate(this.getValue());
	if(value && $tw.utils.isDate(value) && value.toString() !== "Invalid Date") {
		return $tw.utils.getRelativeDate((new Date()) - (new Date(value))).description;
	} else {
		return "";
	}
};

ViewWidget.prototype.getValueAsStrippedComments = function() {
	var lines = this.getValueAsText().split("\n"),
		out = [];
	for(var line=0; line<lines.length; line++) {
		var text = lines[line];
		if(!/^\s*\/\/#/.test(text)) {
			out.push(text);
		}
	}
	return out.join("\n");
};

ViewWidget.prototype.getValueAsJsEncoded = function() {
	return $tw.utils.stringify(this.getValueAsText());
};

var getf = new ViewWidget();
return getf.getf();
}

})();

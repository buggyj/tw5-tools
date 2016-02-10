/*\
title: $:/core/modules/parsers/htmlparser.js
type: application/javascript
module-type: parser

The HTML parser displays text as raw HTML

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var HtmlParser = function(type,text,options) {
	var src,sandbox;
	if(options._canonical_uri) {
		src = options._canonical_uri;
	} else if(text) {
		src = "data:text/html;charset=utf-8," + encodeURIComponent(text);
	}
	if (options.parserrules && options.parserrules.sandbox) {
		sandbox = options.parserrules.sandbox;
	}
	else {
		sandbox = "sandbox";
	}
	this.tree = [{
		type: "element",
		tag: "iframe",
		attributes: {
			src: {type: "string", value: src},
			sandbox: {type: "string", value: sandbox}
		}
	}];
};

exports["text/html"] = HtmlParser;

})();


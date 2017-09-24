/*\
title: $:/bj/modules/parsers/regex.js
type: application/javascript
module-type: parser

replace using a separate file of regexes

\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
var doregex=function(text,fileofregexes){
		var tid = $tw.wiki.getTiddlerText(fileofregexes),n,lines;
		if (!tid) return text;
		lines = tid.split(/\n/);
		for (n=0; n<lines.length; n++) {
			var parts;
			if ((parts = (lines[n].replace(/([^\\])\/|^\//g, '$1\u000B').split('\u000B'))).length !=4) break;
			var pattern=new RegExp(parts[1],parts[3]);
			text = text.replace(pattern, parts[2]);
		} 
		return text;
}

var PreParser = function(type,text,options) {
	if (!!options.parserrules&&!!options.parserrules.replacementstid) {
		text=doregex(text,options.parserrules.replacementstid);
	}
	this.tree = [{
		type: "element",
		tag: "pre",
		children: [{
			type: "text",
			text: text
		}]
	}];
};

exports["text/x-regexparse"] = PreParser;

})();

/*\
title: $:/core/modules/parsers/nullparser.js
type: application/javascript
module-type: parser

The null parser parses a json tree of already parsed wikitext 

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var NullParser = function(type,text,options) {

	this.tree = JSON.parse(text);
};

exports["json/x-tree"] = NullParser;

})();


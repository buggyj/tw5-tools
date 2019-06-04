/*\
title: $:/core/modules/filters/tagsub.js
type: application/javascript
module-type: filteroperator

Filter operator for checking for the presence of a tag

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
var myHasTag = function(tiddler,op) {

 if(!op&&(!tiddler.hasField("tags")||tiddler.fields.tags=='')) {return true;}
	return tiddler.hasTag(op);
};


exports.tagsub = function(source,operator,options) {
	var results = {};
	if(operator.prefix === "!") {
		source(function(tiddler,title) {
			if(tiddler && !myHasTag(tiddler,operator.operand)) {
				results[title] = tiddler;
			}
		});
	} else {
		source(function(tiddler,title) {
			if(tiddler && myHasTag(tiddler,operator.operand)) {
				results[title] = tiddler;
			}
		});
		//results = options.wiki.sortByList(results,operator.operand);
		
	}
	return function(callback) {	

			for(var subTiddler in results) {
					callback(results[subTiddler],subTiddler);
			}
	}
};

})();

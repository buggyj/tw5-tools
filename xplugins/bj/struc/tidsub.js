/*\
title: $:/core/modules/filters/tibsub.js
type: application/javascript
module-type: filteroperator

Filter operator for checking for the presence of a subtid

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/

function is(tiddler,x) {
	return tiddler.fields.title == x;
}

exports.tidsub = function(source,operator,options) {
	var results = {};
	if(operator.prefix === "!") {
		source(function(tiddler,title) {
			if(tiddler && !is(tiddler,operator.operand)) {
				results[title] = tiddler;
			}
		});
	} else {
		source(function(tiddler,title) {
			if(tiddler && is(tiddler,operator.operand)) {
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

})()

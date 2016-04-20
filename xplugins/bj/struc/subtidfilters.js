/*\
title: $:/bj/modules/filters/plugin.js
type: application/javascript
module-type: filteroperator
Filter operator for selecting tiddlers from a plugin
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.plugin = function(source,operator,options) {
	return forTiddlersInTiddler(operator.operand);
}

var forTiddlersInTiddler = function(titleOfPlugin) {
	// Iterate through all the Contained  tiddlers
	var title = titleOfPlugin;
	return function(callback) {	
                var tiddler = $tw.wiki.getTiddler(title);
try {
		var bundle = JSON.parse(tiddler.fields.text);
}catch (e) {}
		if(bundle && bundle.tiddlers) { 
			for(var subTiddler in bundle.tiddlers) {
					callback(new $tw.Tiddler(bundle.tiddlers[subTiddler]),subTiddler);
			}
		}
	}
};
})();

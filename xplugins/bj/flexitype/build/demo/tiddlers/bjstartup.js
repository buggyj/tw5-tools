/*\
title: bjstartup.js
type: application/javascript
module-type: startup

Initialise $:/info tiddlers via $:/temp/info-plugin pseudo-plugin

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "info";
exports.before = ["load-modules"];
exports.synchronous = true;
exports.platforms = ["browser"];

exports.startup = function() {
	if (window.location["hostname"].toString() !="127.0.0.1") 	$tw.wiki.addTiddler(new $tw.Tiddler({title: "$:/config/SyncFilter",text:"[title[message]]"}));;
};

})();

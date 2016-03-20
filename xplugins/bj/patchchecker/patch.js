/*\
title: $:/bj/modules/patchchecker.js
type: application/javascript
module-type: startup

Miscellaneous startup logic for both the client and server.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "patchchecker";
exports.after = ["load-modules"];
exports.platforms = ["browser"];
exports.synchronous = true;

var widget = require("$:/core/modules/widgets/widget.js");

exports.startup = function() {
	var thisversion, patchplugins;

	thisversion = $tw.utils.extractVersionInfo();
	patchplugins = $tw.wiki.filterTiddlers("[plugin-type[plugin]extended-type[patch]]");
	$tw.utils.each(patchplugins,function(title) {
		var tiddler = $tw.wiki.getTiddler(title);
		if(tiddler && tiddler.hasField("version")) {
			if (!equalVersions(thisversion, tiddler.fields.version)) alert("out of sync: "+title)
		}
	})
};

var equalVersions = function(versionStringA,versionStringB) {
	var defaultVersion = {
		major: 0,
		minor: 0,
		patch: 0
	},
	versionA = $tw.utils.parseVersion(versionStringA) || defaultVersion,
	versionB = $tw.utils.parseVersion(versionStringB) || defaultVersion,
	diff = [
		versionA.major - versionB.major,
		versionA.minor - versionB.minor,
		versionA.patch - versionB.patch
	];
	return (diff[0] == 0 && diff[1] == 0 && diff[2] == 0);
};

})();




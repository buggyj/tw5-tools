/*\
title: $:/bj/macros/if/Calendar/heatmap.js
type: application/javascript
module-type: macro

Options: $:/config/bj/CalendarOpts/'name'
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var name = module.id.replace(/^[\s\S]*\/([^\/]*)\.js$/,"$1");//the part of tid name between last / and .js

exports.name = name;

exports.params = [
	{ name: "year" },{ name: "month" },{ name: "opts" }
];

exports.run = function(year, month,opts) {
	if (!opts) opts = "";
	return '<$macrorefresh $name="calendarbase" year="'+year+'" month="'+month+'" name="'+name+'" opts="'+opts+'" $refresh="calendarrefresh"/>';

}

})();

/*\
title: $:/macros/buggyj/Calendar/entrynewdiary.js
type: application/javascript
module-type: macro

<<newdiary year month>>
<<newdiary year>> - year calendar
<<newdiary>> - this month

Options:$:/macros/diary/options.json
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
CAL demo
*/

exports.name = "newdiary";

exports.params = [
	{ name: "year" },{ name: "month" },{ name: "opts" }
];
/*
Run the macro
*/

exports.run = function(year, month,opts) {
	if (!opts) opts = "newdiary";
	return '<$macrorefresh $name="calendarbase" year="'+year+'" month="'+month+'" opts="'+opts+'" $refresh="calendarrefresh"/>';

}

})();

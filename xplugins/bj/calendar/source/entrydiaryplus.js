/*\
title: $:bj/macro/if/Calendar/diaryplus.js
type: application/javascript
module-type: macro

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
CAL demo
*/

exports.name = "diaryplus";

exports.params = [
	{ name: "year" },{ name: "month" },{ name: "opts" }
];
/*
Run the macro
*/
var name="diaryplus";
exports.run = function(year, month,opts) {
	if (!opts) opts = "";
	return '<$macrorefresh $name="calendarbase" year="'+year+'" month="'+month+'" name="'+name+'" opts="'+opts+'" $refresh="calendarrefresh"/>';

}

})();


/*\
title: $:/macros/buggyj/Calendar/refresh.js
type: application/javascript
module-type: macro

<<diary year month>>
<<diary year>> - year calendar
<<diary>> - this month

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

exports.name = "calendarrefresh";

exports.params = [
	{ name: "year" },{ name: "month" },{ name: "name" },{ name: "opts" },{name:"changedTiddlers"}
];
 

/*
Run the macro
*/

exports.run = function(year, month,name,opts,changedTiddlers) {

	var found = false;
	var journaltag = "Journal";
	var options,optid,overrides;
	var optjson = $tw.wiki.getTiddlerData("$:/config/bj/Calendar.json");
	options =optjson[name]||
					{lastDayOfWeek:"6",formatter:"",titlebold:"",highlightThisDay:"",highlightThisDate:""};

	if (opts) {
		optid = "$:/config/bj/CalendarOpts/"+opts;
		overrides =  $tw.wiki.getTiddlerData(optid);
		if (!overrides) overrides =optjson[opts]||{};
		options = Object.assign(options, overrides);
	}		

	if (options && options.$extrefresh) { 
		
		$tw.utils.each(changedTiddlers,function(attribute,name) {
			if (attribute.deleted) {
				found = true;
				return;
			}
		   if (optid === name) {
				found = true;
				return;
			}
			var tiddler = $tw.wiki.getTiddler(name);
			var tags = (tiddler.fields.tags || []).slice(0);
			
			if(tags.indexOf(journaltag) != -1) {
				found = true;	
			}
		});
	} else { 
		$tw.utils.each(changedTiddlers,function(attribute,name) {
			if (attribute.deleted) {
				return;
			}
			var tiddler = $tw.wiki.getTiddler(name);
			var tags = (tiddler.fields.tags || []).slice(0);
			
			if(tags.indexOf(journaltag) != -1) {
				found = true;	
			}
		});
	} 
		if (found) return "found";
		return ""; 
	}
})();

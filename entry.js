/*\
title: $:/macros/buggyj/Calendar/entry.js
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
diary demo
*/

exports.name = "calendar";

exports.params = [
	{ name: "year" },{ name: "month" },{ name: "opts" }
];
/*
Run the macro
*/

exports.run = function(year, month,opts) {
if (!opts) opts="default";
var options = $tw.wiki.getTiddlerData("$:/plugins/bj/Calendar/config.json")[opts]||
				{lastDayOfWeek:"6",formatter:"",titlebold:"",highlightThisDay:"",highlightThisDate:""};
var createMonth;
try {
	createMonth = require(options.formatter).createMonth;
} catch (e) {
	createMonth= function(mnth,year){
		var month=[];
		for (var i=1;i < 1+daysInMonth(mnth,year);i++) month[i] = i;
		return month;
	}
} 
var boldtitle=(options.titlebold=='yes')?'!':'';
var day_of_week = $tw.config.dateFormats.shortDays;
var month_of_year = $tw.config.dateFormats.months; 
var Calendar = new Date();
var thisyear = Calendar.getFullYear();  //  year (xxxx)
var thismonth = Calendar.getMonth();	//  month (0-11)
var thisday = Calendar.getDay();        //  day (0-6)
var WEEKFIN = parseInt(options.lastDayOfWeek);               
var MONTHS_IN_YEAR=12;					
                           
var lf ='\n';
var cal='<div>'+lf; 
var ayear=thisyear;
if (!!month) {
	if (!!year) {
		cal+=calendar (month-1,year,options);
	} else {
		cal+=calendar (month-1,thisyear,options);
	}
} else {
	if (!!year) ayear=year; 
	for(var i=0; i<MONTHS_IN_YEAR; i+=2)
		cal+=splicetable(calendar (i,ayear,options),calendar (i+1,ayear,options));
}
return cal+lf+'</div>';

function calendar (mnth,year,options){
    var month =	createMonth(mnth,year,options);
    var blankdays = (firstDayInMonth(mnth,year)+13-WEEKFIN)%7;
	return titleOfMonth(mnth,year)+createWeekHeading()+
	       formatAsMonth(month,blankdays);
}
function titleOfMonth(mth,year) {
	return '|>|>|>|'+ centre(boldtitle+ month_of_year[mth]  + '  ' + year) +'|<|<|<|'+lf;
}
function centre (x){ return ' '+x+' ';}

function formatAsMonth(month,blankdays){	
	var theday,blank=['','|','||','|||','||||','|||||','||||||','|||||||'];	
	var cal=blank[blankdays];//pad out before first day of month
	for(var i=1; i < month.length;i++){//first '0' month element is not used
		cal+='|'+month[i];
		theday=(i+blankdays-1)%7;
		if (theday== 6) cal +='|'+lf; 
	}
	cal+=blank[7-theday]+(7-theday>1?lf:'');//pad out rest of week, if no blanks then lf was added in loop
	return cal ;
}
function createWeekHeading(){
		var daystitle=[],weekdays= day_of_week.slice(0);
		// highlight today's day of week
		if (options.highlightThisDay=='yes')weekdays[thisday] ='!'+weekdays[thisday];
		for (var i=0;i < weekdays.length; i++) daystitle[i] =centre(weekdays[(i+1+WEEKFIN)%7]);
		return '|'+daystitle.join('|')+'|'+lf; 
}
function daysInMonth(iMonth, iYear){
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}
function firstDayInMonth(iMonth, iYear){
		return new Date(iYear, iMonth, 1).getDay();
	} 
function splicetable (a,b) {
	var i,cal='',taba =a.split('\n'),tabb=b.split('|\n');
	var limit=(taba.length<tabb.length)?taba.length:tabb.length;//shortest
	for (i=0;i<limit-1;i++) 		cal+=taba[i]+tabb[i]+'|'+lf;	 
	for (;i < taba.length-1;i++) 	cal+=taba[i]+"||||||||"+lf;
	for (;i < tabb.length-1;i++) 	cal+="||||||||"+tabb[i]+lf;
	return cal;
}		   
}  

})();

/*\
title: $:/macros/buggyj/Calendar/base.js
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

exports.name = "calendarbase";

exports.params = [
	{ name: "year" },{ name: "month" },{ name: "name" },{ name: "opts" }
];
/*
Run the macro
*/

exports.run = function(year, month ,name, opts) {
var options,optid, overrides;
var optjson = $tw.wiki.getTiddlerData("$:/config/bj/Calendar.json");
options =$tw.wiki.getTiddlerData("$:/config/bj/CalendarOpts/"+name)||optjson[name]||
				{lastDayOfWeek:"6",formatter:"",titlebold:"",highlightThisDay:"",highlightThisDate:""};

if (opts) {
	optid = "$:/config/bj/CalendarOpts/"+opts;
	overrides =  $tw.wiki.getTiddlerData(optid);
	if (!overrides) overrides =optjson[opts]||{};
	options = Object.assign(options, overrides);
}				
var createMonth,createSummary;
try {
    createSummary =  require(options.formatter).createSummary
	createMonth = require(options.formatter).createMonth;
} catch (e) {
	createMonth= function(mnth,year){
		var month=[];
		for (var i=1;i < 1+daysInMonth(mnth,year);i++) month[i] = i;
		return month;
	}
} 
var boldtitle=(options.titlebold=='yes')?'!':'';
var day_of_week = (function () { 
	var days = [];
	for (var i = 0; i < 7; i++) {days[i] = $tw.language.getString("Date/Short/Day/" + i); } 
	return days;
})();
var month_of_year = (function () { 
	var months = [];
	for (var i = 1; i < 13; i++) {months[i] = $tw.language.getString("Date/Long/Month/" + i); } 
	return months;
})(); 
var Calendar = new Date();
var thisyear = Calendar.getFullYear();  //  year (xxxx)
var thismonth = Calendar.getMonth()+1;	//  month (0-11)
var thisday = Calendar.getDay();        //  day (0-6)
var WEEKFIN = parseInt(options.lastDayOfWeek);               
var MONTHS_IN_YEAR=12;					
                           
var lf ='\n';
var cal='<div>'+lf+lf; console.log (options) 
var classes = options["$class"] + " " + options["$classplus"];
if (options["$class"]) cal += "|"+classes+"|k" + lf; 
var ayear=thisyear;
if (!!month) {
	if (!!year) {
		cal+=calendar (month,year,options);
	} else {
		cal+=calendar (month,thisyear,options);
	}
} else {
	if (!!year) {
			cal+=titleOfYear(year); 
		options.seperateYearHeading = 'yes';
		ayear=year; 
        if (options.ncols=='1') for(var i=0; i<MONTHS_IN_YEAR; i+=1) cal+=calendar (i+1,thisyear,options);	
		else if (options.ncols=='3') for(var i=0; i<MONTHS_IN_YEAR; i+=3) {
var cal2=splicetable(calendar (i+1,ayear,options),calendar (i+2,ayear,options),"||||||||","||||||||");
 cal+=splicetable(cal2,calendar (i+3,ayear,options),"||||||||"+"||||||||","||||||||");
}
else if (options.ncols=='4') for(var i=0; i<MONTHS_IN_YEAR; i+=4) {
var cal2=splicetable(calendar (i+1,ayear,options),calendar (i+2,ayear,options),"||||||||","||||||||");
var cal3=splicetable(calendar (i+3,ayear,options),calendar (i+4,ayear,options),"||||||||","||||||||");
 cal+=splicetable(cal2,cal3,"||||||||"+"||||||||","||||||||"+"||||||||");
}
else for(var i=0; i<MONTHS_IN_YEAR; i+=2)  cal+=splicetable(calendar (i+1,ayear,options),calendar (i+2,ayear,options),"||||||||","||||||||");

	}
	else {
			cal+=calendar (thismonth,thisyear,options);	
	}
}
return cal+lf+lf+'</div>';

function calendar (mnth,year,options){
    var month =	createMonth(mnth,year,options);
    var blankdays = (firstDayInMonth(mnth,year)+13-WEEKFIN)%7;
	return titleOfMonth(mnth,year)+((!!options['$summarymacro'])?addSummary(mnth,year,options):'')+((!options['$noweekdays'])?createWeekHeading():'')+ formatAsMonth(month,blankdays);
}
function titleOfMonth(mth,year) {
	if (!!options.seperateYearHeading ) {
		return '|>|>|>|'+ centre(boldtitle+ month_of_year[mth]) +'|<|<|<|'+lf;
	} else {
		return '|>|>|>|'+ centre(boldtitle+ month_of_year[mth]  + '  ' + year) +'|<|<|<|'+lf;
	}
}

function titleOfYear(year) {
		return  '|>|>|>|>|>|>|>|'+ '>|>|>|>|>|>|>|>|'+ centre('!'+year) +'|<|<|<|<|<|<|<' +'|<|<|<|<|<|<|<|<|'+lf;
}
function centre (x){ return ' '+x+' ';}

function formatAsMonth(month,blankdays){	
	var theday,blank=['','|','||','|||','||||','|||||','||||||','|||||||'];	
	var cal=blank[blankdays];//pad out before first day of month
	for(var i=1; i < month.length;i++){//first '0' month element is not used
		cal+='|'+month[i];
		theday=(i+blankdays-1)%7;
		if (theday == 6) cal += '|' + lf; 
	}
	if (theday !== 6) cal += blank[7 - theday] + lf;//pad out rest of week, if needed
	return cal ;
}
function addSummary(mnth,year,options){
		return '|>|>|>|'+createSummary(mnth,year,options) +'|<|<|<|'+lf;
}
function createWeekHeading(){
		var daystitle=[],weekdays= day_of_week.slice(0);
		// highlight today's day of week
		if (options.highlightThisDay=='yes')weekdays[thisday] ='!'+weekdays[thisday];
if (options.DaysSmall=='yes')for (var i=0;i < weekdays.length; i++) weekdays[i] =weekdays[i][0];
		for (var i=0;i < weekdays.length; i++) daystitle[i] =centre(weekdays[(i+1+WEEKFIN)%7]);
		return '|'+daystitle.join('|')+'|'+lf; 
}
function daysInMonth(iMonth, iYear){
		return 32 - new Date(iYear, iMonth-1, 32).getDate();
	}
function firstDayInMonth(iMonth, iYear){
		return new Date(iYear, iMonth-1, 1).getDay();
	} 
function splicetable (a,b,sep1,sep2) {
	var i,cal='',taba =a.split('\n'),tabb=b.split('|\n');
	var limit=(taba.length<tabb.length)?taba.length:tabb.length;//shortest
	for (i=0;i<limit-1;i++) 		cal+=taba[i]+tabb[i]+'|'+lf;	 
	for (;i < taba.length-1;i++) 	cal+=taba[i]+sep2+lf;
	for (;i < tabb.length-1;i++) 	cal+=sep1+tabb[i]+'|'+lf;
	return cal;
}		   
}  

})();

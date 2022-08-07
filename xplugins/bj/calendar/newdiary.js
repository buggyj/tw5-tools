/*\
title: $:/macros/bj/Calendar/newdiary.js
type: application/javascript
module-type: global
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
calendar demo
*/
var Calendar=new Date();
var createMonth= function(mnth,year,options){
	var month=[];
	for (var i=1;i < 1+daysInMonth(mnth,year);i++) month[i] = createDate(i,mnth,year,options);
	return month;
}
function createDate(i,mnth,year,options){
	var strong='',rawDate,tiddlerDate,format = $tw.wiki.getTiddlerText("$:/config/NewJournal/Title") || "YYYY MM DD";
var tags = ($tw.wiki.getTiddlerText("$:/config/NewJournal/Tags")||"").trim();
	var date=(new Date(year, mnth-1, i));
	if (options.highlightLinks=="yes") strong ='!';
	
	tiddlerDate = $tw.utils.formatDateString(date,format);
    rawDate= $tw.utils.formatDateString(date,"YYYY0MM0DD");
   
	if ($tw.wiki.getTiddler(tiddlerDate))return centre(strong+'<<diarydets ' + i +' """'+ tiddlerDate+'""" '+rawDate+' '+tags+'>>');
	return  centre('<<diarydets ' + i +' """'+ tiddlerDate+'""" '+rawDate+' '+tags+'>>');
}
function daysInMonth(iMonth, iYear){
		return 32 - new Date(iYear, iMonth-1, 32).getDate();
	}
function centre (x){ return ' '+x+' ';}
exports.createMonth = createMonth;
})();


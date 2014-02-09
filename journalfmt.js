/*\
title: $:/macros/bj/Calendar/journalfmt.js
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
	var strong='';
	var date=(new Date(year, mnth, i));
	if (date.toDateString()===Calendar.toDateString()&&options.highlightThisDate=="yes") strong ='!';
	return centre(strong+'[['+i+'|'+date.getDate()+
	              ' '+$tw.config.dateFormats.months[date.getMonth()]+' '+date.getFullYear()+']]');
}
function daysInMonth(iMonth, iYear){
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}
function centre (x){ return ' '+x+' ';}
exports.createMonth = createMonth;
})();

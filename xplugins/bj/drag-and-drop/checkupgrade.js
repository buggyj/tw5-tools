/*\
title: $:/core/modules/widgets/checkupgrade.js
type: application/javascript
module-type: widget

List and list item widgets

\*/
(function(){
if($tw.browser)  {
	if($tw.wiki.tiddlerExists("$:/plugins/bj/taglist")) {
		var disablingTiddler = $tw.wiki.getTiddler("$:/config/Plugins/Disabled/" + "$:/plugins/bj/taglist");
		if(disablingTiddler && (disablingTiddler.fields.text || "").trim() === "yes") { 
			return;
		}
		alert("drag-and-drop extension relapaces the taglist plugin, please delete or disable the taglist plugin");
	}
}
})();


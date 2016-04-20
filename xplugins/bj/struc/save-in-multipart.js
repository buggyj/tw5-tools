/*\
title: $:/bj/modules/widgets/multisaver.js
type: application/javascript
module-type: widget

MultiSaver - saves drafts to multitids
Listens for tm-save-in-multipart -
the parameter is the draftname with form Draft if 'container->innertiddler'

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;


var MultiSaver = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
		{type: "tm-save-tiddler", handler: "handleSaveTiddlerEvent"}
	]);
};
MultiSaver.prototype = new Widget();
/*
Render this widget into the DOM
*/
MultiSaver.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
MultiSaver.prototype.execute = function() {
	// Get our parameters
    this.msg=this.getAttribute("msg");
    if (this.msg) {
		this.eventListeners = {};
		this.addEventListeners([
			{type: this.msg, handler: "handleEvent"}
		]);
	}
    // Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
MultiSaver.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes["msg"] ) {
		this.refreshSelf();
		return true;
	}
	else {
		return this.refreshChildren(changedTiddlers);
	}
};

// Take a tiddler out of edit mode, saving the changes
MultiSaver.prototype.handleSaveTiddlerEvent = function(event) {
	/*
	 * draft.title is the subtiddler title
	 * draft.of is the whole title -eg container->subtiddler
	 * title is "Draft of '" + whole title
	*/
	var title = event.param || event.tiddlerTitle,
	 	tiddler = this.wiki.getTiddler(title); //local temp - draft version

	// Replace the original tiddler with the draft
	if(tiddler) {
		var newTitle = (tiddler.fields["draft.title"] || "").trim(),
			draftOf = this.getMultiTidTitle((tiddler.fields["draft.of"] || "").trim());
		if(newTitle) {
			var isRename = draftOf.title !== newTitle,
				isConfirmed = true;
			if(isRename && this.tiddlerExists(draftOf.container,newTitle)) {
				isConfirmed = confirm($tw.language.getString(
					"ConfirmOverwriteTiddler",
					{variables:
						{title: newTitle}
					}
				));
			}
			if(isConfirmed) {
				// Create the new tiddler and pass it through the th-saving-tiddler hook
				var newTiddler = new $tw.Tiddler(this.wiki.getCreationFields(),tiddler,{
					title: newTitle,
					"draft.title": undefined,
					"draft.of": undefined
				},this.wiki.getModificationFields());
				//newTiddler = $tw.hooks.invokeHook("th-save-in-multipart",newTiddler);BJ meditation - add hook
				this.addTiddler(draftOf.container,newTiddler);
				// Remove the draft tiddler
				this.wiki.deleteTiddler(title);
				// Remove the original tiddler if we're renaming it
				if(isRename) {
					this.deleteTiddler(draftOf.container,draftOf.title);
				}
				this.dispatchEvent({type: "tm-close-tiddler", param:title}); 
				// Trigger an autosave
				$tw.rootWidget.dispatchEvent({type: "tm-auto-save-wiki"});
			}
		}
	}
	return false;
};

MultiSaver.prototype.getMultiTidTitle = function(title) {
		var p = title.indexOf("->"), container, tid;
		if(p !== -1) {
			container = title.substr(0, p).trim();
			tid = title.substr(p+2).trim();
		} else {
			tid = title;
		}
		return {container:container, title:tid};
}

MultiSaver.prototype.addTiddler = function(parent, tiddler) {
	var container =  $tw.wiki.getTiddler(parent), text;
	if (container) {
		text = JSON.parse(container.fields.text);
	} else {
		return;
	}
	//add the new subtiddler
	var fields = new Object();
	for(var field in tiddler.fields) {
		fields[field] = tiddler.getFieldString(field);
	}
	text.tiddlers[tiddler.fields.title] = fields;

	var updateFields = {
		text: JSON.stringify(text)
	};	
	$tw.wiki.addTiddler(new $tw.Tiddler(container,updateFields,$tw.wiki.getModificationFields()));	

}

MultiSaver.prototype.tiddlerExists = function(parent,title) {
	var container =  $tw.wiki.getTiddler(parent), text;
	if (container) {
		text = JSON.parse(container.fields.text);
	} else {
		return false;
	}
	return !!$tw.utils.hop(container,title);
}

MultiSaver.prototype.getTiddler = function(parent,title) {
	var container =  $tw.wiki.getTiddler(parent), text;
	if (container) {
		text = JSON.parse(container.fields.text);
	} else {
		return ;
	}
	var subTiddler = text.tiddlers[tiddler.fields.title];
		if(subTiddler) {
			return new $tw.Tiddler(subTiddler);
		}	
}

MultiSaver.prototype.deleteTiddler = function(parent, title) {
	var container =  $tw.wiki.getTiddler(parent), text;
	if (container) {
		text = JSON.parse(container.fields.text);
	} else {
		return;
	}
	delete text.tiddlers[title];

	var updateFields = {
		text: JSON.stringify(text)
	};	
	$tw.wiki.addTiddler(new $tw.Tiddler(container,updateFields,$tw.wiki.getModificationFields()));	

}

exports.multisaver = MultiSaver;

})();

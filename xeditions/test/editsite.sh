#!/bin/bash



# The tw5.com wiki
#  index.html: the main file, including content
#  empty.html: the main file, excluding content
#  static.html: the static version of the default tiddlers



# codemirrordemo.html: wiki to demo codemirror plugin
rm tiddlywiki.info
ln -s  tiddlywiki.info.web tiddlywiki.info 
node ../../tiddlywiki.js \
	--verbose \
	--server 8079 $:/core/save/all \
	|| exit 



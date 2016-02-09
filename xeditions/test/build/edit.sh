#!/bin/bash

# add the root of tw5 
if [  -z "$TW5_ROOT" ]; then
    TW5_ROOT=../../../../../../..
fi

if [  ! -d "$TW5_ROOT" ]; then
    TW5_ROOT=../../../../../../..
fi

# add path to root of plugin
# export TIDDLYWIKI_EDITION_PATH="${PWD%/*/*/*}:$TIDDLYWIKI_EDITION_PATH"
export TIDDLYWIKI_PLUGIN_PATH="${PWD%/*/*/*}/xplugins:$TIDDLYWIKI_PLUGIN_PATH"

node $TW5_ROOT/tiddlywiki.js \
	../nodejs \
	--verbose \
	--server 8080 $:/core/save/all \
	|| exit 1



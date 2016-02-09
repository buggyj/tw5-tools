#!/bin/bash

# Set up the build output directory
if [  -z "$TW5_BUILD_OUTPUT" ]; then
    TW5_BUILD_OUTPUT=.
fi

if [  ! -d "$TW5_BUILD_OUTPUT" ]; then
    TW5_BUILD_OUTPUT=.
fi

# and the root of tw5 
if [  -z "$TW5_ROOT" ]; then
    TW5_ROOT=../../../../../../..
fi

if [  ! -d "$TW5_ROOT" ]; then
    TW5_ROOT=../../../../../../..
fi

# add path to root of plugin
# export TIDDLYWIKI_EDITION_PATH="${PWD%/*/*/*}:$TIDDLYWIKI_EDITION_PATH"
export TIDDLYWIKI_EDITION_PATH="${PWD%/*/*/*}/xplugins:$TIDDLYWIKI_PLUGIN_PATH"

node $TW5_ROOT/tiddlywiki.js \
	../browser \
	--verbose \
	--rendertiddler $:/core/save/all $TW5_BUILD_OUTPUT/testtools.html text/plain \
	|| exit 1



#!/bin/bash

node ../../../../tiddlywiki.js \
	./demoedit \
	--verbose \
	--server 8080 $:/core/save/all \
	|| exit 1



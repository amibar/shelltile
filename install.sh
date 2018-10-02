#!/bin/bash

SHELLTILE_PATH=~/.local/share/gnome-shell/extensions/ShellTile@emasab.it

mkdir -p $SHELLTILE_PATH
mkdir -p $SHELLTILE_PATH/schemas
mkdir -p $SHELLTILE_PATH/locale

cp *.js $SHELLTILE_PATH/
cp *.json $SHELLTILE_PATH/
cp *.css $SHELLTILE_PATH/
cp -r schemas/.  $SHELLTILE_PATH/schemas/
cp -r locale/.  $SHELLTILE_PATH/locale/

#!/bin/bash
PKG_VERSION=`node -p "require('./manifest.json').version"`  
file="web-ext-artifacts/plume-$PKG_VERSION.zip"

if [ -f "$file" ]
then
	echo "File exists, change version number in manifest.json"
else
	echo "$file not found. building"
    web-ext build
    butler push web-ext-artifacts/plume-$PKG_VERSION.zip ragekit/plume:webextension --userversion $PKG_VERSION
fi


# NOTE : this build script is used to work with my itch.io account, to build without uploading just use web-ext build
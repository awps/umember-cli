#!/usr/bin/env bash

# Get the current release version
TAG=$(sed -e "s/refs\/tags\///g" <<< $GITHUB_REF)

# Replace the version in these 2 files.
sed -i -e "s/\"version\": \"0.1.0\"/\"version\": \"$TAG\"/g" ./package.json

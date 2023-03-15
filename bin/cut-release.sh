#!/bin/bash

VERSION=$1

# Bump package.json
jq --arg VERSION $VERSION '.version = $VERSION' package.json > updated.json && mv updated.json package.json

# Install latest deps
npm install

# Run all tests and package the dist/*
npm run all
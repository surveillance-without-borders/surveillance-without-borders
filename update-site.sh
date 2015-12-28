#!/bin/sh
grunt build
echo surveillancewithoutborders.com > dist/CNAME
ghp-import -p dist/

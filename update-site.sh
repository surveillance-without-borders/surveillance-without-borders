#!/bin/sh
grunt build
rsync -aP dist/ surveillancewithoutborders.com:/var/www/surveillancewithoutborders.com

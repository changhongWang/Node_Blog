#!/bin/sh
cd /Users/changhong/VSCodeProjects/Study/Project/Blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
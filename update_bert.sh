#!/bin/bash

# Zip up all JS files in bert
zip -rX zips/bert.zip . -i node_modules/*.* *.js *.json

# Update BertLambda with new index.js version
aws lambda update-function-code --function-name BertLambda --zip-file fileb://zips/bert.zip

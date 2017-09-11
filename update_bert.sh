#!/bin/bash

# Zip up all JS files in bert
zip -rX zips/bert.zip . -i \*.js

# Update BertLambda with new index.js version
aws lambda update-function-code --function-name BertLambda --zip-file fileb://zips/bert.zip

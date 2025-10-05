#!/bin/bash
if [[ -d .git  ]]; then git pull; fi;
node deploy-commands.js
node index.js
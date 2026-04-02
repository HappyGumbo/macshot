#!/usr/bin/env node
'use strict';
const { resolve } = require('path');
const cli = require(resolve(__dirname, '..', 'dist', 'cli.js'));
cli.run();

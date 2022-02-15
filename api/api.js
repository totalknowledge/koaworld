#!/usr/bin/env node

const Koa = require('koa');
const logger = require('koa-visit-logger');
const koaBody = require('koa-body');

// create app instance
const app = new Koa();

// middleware functions
app.use(logger());
app.use(koaBody());

// Require the router here
let worlds = require('./worlds.js');
// use the router here
app.use(worlds.routes());

app.listen(3000);
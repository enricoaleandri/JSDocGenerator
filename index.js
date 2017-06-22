#!/usr/bin/env nodejs
/**
 * Created by enrico on 22/06/17.
 */


var jsdocgen = require("./JSdocParser");
var astParser = require("./ASTParser");



var fn="./JSdocParser.js"
if(process.argv.indexOf("-f")!== -1)
  fn=process.argv[process.argv.indexOf("-f")+1];

var debugMode = false;
if(process.argv.indexOf("-debug")!== -1)
  debugMode = true;

var a = astParser.addCommentToFile(fn, debugMode);
console.log(a);
#!/usr/bin/env nodejs

var escodegen = require( 'escodegen' );
var fs = require("fs");

var fn = "./astFile/function.json";
if(process.argv[2]=="-f")
  fn=process.argv[3]


var file =  fs.readFileSync(fn,"utf8");

console.log(escodegen.generate(JSON.parse(file),{ comment: true } ));


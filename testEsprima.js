/**
 * Created by enrico on 22/06/17.
 */
var esprima = require( 'esprima' );
var fs = require("fs");

var file =  fs.readFileSync("./jsFile/simple.js","utf8");
console.log(file);
var ast = esprima.parse(file,  { comment: true });

console.log(ast);


/*
 var a = jsdocgen.parseAttribute("params", {name : "A" , type : "Number", description : "ciao mondo "});
 var b = jsdocgen.parseAttribute("params", {name : "A" });
 var c = jsdocgen.parseAttribute("returns", {name : "A" , type : "Number", description : "ciao mondo "});

 var attributes = [
 {
 attributeName: "params",
 args: {name: "A", type: "Number", description: "ciao mondo sono un parametro"}
 },
 {
 attributeName: "params",
 args: {name: "B"}
 },
 {
 attributeName: "returns",
 args: {name : "A" , type : "Number|Array", description : "ciao mondo sono un Return "}
 }
 ];

 var com = jsdocgen.parseComment(attributes);
 console.log(com);

 */
/**
 * Created by enrico on 22/06/17.
 */


var jsdocgen = require("./JSdocParser");
var astParser = require("./ASTParser");


var a = astParser.addCommentToFile("./jsFile/function.js");
console.log(a);
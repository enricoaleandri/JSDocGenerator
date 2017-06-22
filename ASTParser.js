/**
 * Created by enrico on 22/06/17.
 */


var esprima = require( 'esprima' );
var escodegen = require( 'escodegen' );
var estraverse = require( 'estraverse' );
var fs = require("fs");
var jsdocparser= require("./JSdocParser");


var ASTParser  = function() {
  ASTParser.prototype.getFile = function (filename) {
    return fs.readFileSync(filename,"utf8")
  };
  ASTParser.prototype.astFromFile = function (filename,loc){
    var LOC=loc||false;
    return  esprima.parse(this.getFile(filename),{loc: LOC,locations:LOC});

  };
  ASTParser.prototype.fileFromAst = function (ast){
    return escodegen.generate(ast,{ comment: true } );
  };
  ASTParser.prototype.generateBlockContent = function(comment){
    var com =  [
      {
        "type": "Block",
        "value": comment,
        "range": [
          0,
          comment.length
        ]
      }
    ];
    return com;
  };
  ASTParser.prototype.addCommentToFile = function (fn,debugMode) {
    astparser = this;
    var ast = astparser.astFromFile(fn, true);
    if(debugMode)
      console.log("\n\n\nAST\n", JSON.stringify(ast));
    var output = estraverse.replace(ast, {

      enter: function (ast, parent) {

        if (ast.rewritten || ast.noExpand)
          return;
        switch (ast.type) {
          case "FunctionDeclaration" : {
            if(typeof ast.params !== "undefined") {
              var attributes = [];
              //pushing Function description - BEGIN
              attributes.push({ attributeName : "description",
                                args: {functionName : ast.id.name}
              });
              //pushing Function description - END
              //pushing Function params - BEGIN
              for (var i = 0; i < ast.params.length; i++){
                var attribute = {};
                attribute.attributeName = "params";
                attribute.args= {name : ast.params[i].name};
                attributes.push(attribute);
              }
              //pushing Function params - END

              //pushing Function returns - BEGIN
              //I'm going to entraverse the sub nodes of function, to find the ReturnStatemane
              // OPENPOINT- what if there is another FunctionDeclaration in this function and it will find before the return on
              //this sub function??
              ast = estraverse.replace(ast,  {

                enter: function (astChild, parent) {

                  if(astChild.type === "ReturnStatement" ) {
                    //TODO - By default the type could be ANY '*', but we need to go over and try to find out the type
                    switch (astChild.argument.type){
                      case "Identifier" :{
                        attributes.push({ attributeName : "returns",
                          args: {type : "*", description : astChild.argument.name}
                        });
                        break;
                      }
                      case "CallExpression" :{
                        attributes.push({ attributeName : "returns",
                          args: {type : "*", description : "Invoking function"}
                        });
                        break;
                      }
                      case "FunctionExpression" :{
                        attributes.push({ attributeName : "returns",
                          args: {type : "Function", description : "Returning function"}
                        });
                        break;
                      }
                    }
                  } // otherwire go over, no return has been found, so it could be a void Function
                }
              });
              //pushing Function returns- END
              //generating comment string from technic attribute
              var comment = jsdocparser.parseComment(attributes);
              ast.leadingComments = astparser.generateBlockContent(comment);
              return ast;
            }else{
              //TOOD- check for arguments usage
            }
            break;
          }
        }
      },
      leave: function (ast, parent) {
      }
    });

    if(debugMode)
      console.log("\n\n\nAST_PARSED\n", JSON.stringify(output));
    return astparser.fileFromAst(output);
  };
};
module.exports = new ASTParser();
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
  ASTParser.prototype.generateBlockContent = function(comment, start){
    var com =  [
      {
        "type": "Block",
        "value": comment,
        "loc": {
          "start" : start,
          "end" : {
            "line" : (comment.match(/\n/g) || []).length,
            "end" : comment.substring(comment.lastIndexOf("\n")+2, comment.length).length
          }
        },
        "range": [
          10,
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
                attribute.attributeName = "param";
                attribute.args= {name : ast.params[i].name};
                attributes.push(attribute);
              }
              //pushing Function params - END

            }else{
              //TOOD- check for arguments usage
            }

            //pushing Function returns - BEGIN
            //I'm going to estraverse the sub nodes of function, to find the ReturnStatement
            estraverse.replace(ast,  {

              enter: function (astChild, parent) {

                if (astChild.rewritten || astChild.noExpand)
                  return;
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
            //generating comment string from tec attribute
            if(attributes.length >0){//If we have no attributes to create comment, simply not create
              var comment = jsdocparser.parseComment(attributes, ast.id.loc);
              ast.leadingComments = astparser.generateBlockContent(comment,ast.id.loc.start);
            }
            return ast;
            break;
          }
          case "VariableDeclaration" : {

            var attributes = [];
            for(var i =0; i< ast.declarations.length; i++){//iterate over all declaration
              switch(ast.declarations[i].init.type){
                case "Literal":{
                  //manage comment for variable declaration
                  attributes.push({ attributeName : "type",
                    args: {name : ast.declarations[i].id.name,
                      type : typeof ast.declarations[i].init.value}
                  });
                  break;
                }
                case "FunctionExpression" : {
                  var fun = ast.declarations[i].init;
                  if(typeof fun.params !== "undefined") {
                    //pushing Function description - BEGIN
                    if(fun.id !== null){
                      attributes.push({ attributeName : "description",
                        args: {functionName : fun.id.name}
                      });
                    }
                    //pushing Function description - END
                    //pushing Function params - BEGIN
                    for (var i = 0; i < fun.params.length; i++){
                      var attribute = {};
                      attribute.attributeName = "param";
                      attribute.args= {name : fun.params[i].name};
                      attributes.push(attribute);
                    }
                    //pushing Function params - END

                  }else{
                    //TOOD- check for arguments usage
                  }

                  //pushing Function returns - BEGIN
                  //I'm going to entraverse the sub nodes of function, to find the ReturnStatement
                  estraverse.replace(ast,  {

                    enter: function (astChild, parent) {

                      if (astChild.rewritten || astChild.noExpand)
                        return;
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
                }//END FunctionExpression

              } // END Switch case on type of declaration
            }//END - For all declaration

            //generating comment string from tec attribute
            if(attributes.length >0) {//If we have no attributes to create comment, simply not create
              ast.loc.start.column += 9; // compensing comment tabulation in JSDocParser
              var comment = jsdocparser.parseComment(attributes, ast.loc);
              ast.leadingComments = astparser.generateBlockContent(comment, ast.loc.start);
            }
            return ast;
            break;
          }//END - VariableDeclaration
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
/**
 * Created by enrico on 22/06/17.
 */


var JSdocParser  = function() {
  JSdocParser.prototype.attributes = {};
  JSdocParser.prototype.attributes.description = " * |#functionName#|";
  JSdocParser.prototype.attributes.param = " * @param {|#type#|} |#name#| - |#description#|";
  JSdocParser.prototype.attributes.type = " * @type {|#type#|} |#name#| - |#description#|";
  JSdocParser.prototype.attributes.class = " * @class";
  JSdocParser.prototype.attributes.returns = " * @returns {|#type#|} |#description#|";


  JSdocParser.prototype.parseAttribute = function(attributeType, args){
    if(typeof this.attributes[attributeType] !== "undefined" ){
      var template = this.attributes[attributeType];
      for(var i = 0; i < Object.keys(args).length ; i++){
        var placeholder = Object.keys(args)[i];
        var value = args[placeholder];
        template = template.replace("|#"+placeholder+"#|", value);
      }
      return template.replace(/\|#(\w+)#\|/g, ""); // after replaced all params provided, I'm gona remove all the rest before return it
    }else{
      return ""; //No attributeType, so No template, I return empty string
    }
  };
  JSdocParser.prototype.parseComment = function (allAttributes, location) {
    var blockComments = "*\n";
    var space = "";
    if(typeof location !== "undefined"
      && typeof location.start !== "undefined"){
      space = Array(location.start.column-9).join(" "); // adding space to keep comment in line
    }
    for(var i = 0; i<allAttributes.length ; i++){
      var attributeName = allAttributes[i].attributeName;
      var params = allAttributes[i].args;
      blockComments+=space+this.parseAttribute(attributeName,params)+"\n";
    }
    return blockComments+" ";
  };
};
module.exports = new JSdocParser();
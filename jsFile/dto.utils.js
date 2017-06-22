/**
 * Created by enrico on 22/06/17.
 */

module.exports = {
  getArray: function(result){
    var dtos = result.map(function (el) {
      el.duplicate = null;
      el.user = false;
      el.mmm_duplicate = null;
      //el.array = [];
      return obj;

    });
    return dtos;
  }

};
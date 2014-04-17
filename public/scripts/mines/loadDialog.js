define([
  '../Lollipop.min', 
  '../spin.min']
, function(Lollipop, Spinner){

  var loadDialog = '<div class="load-dialog-content"></div>'
  return {
    start: function (){
      var ld = $(loadDialog)[0];
      var spinner = new Spinner({
        lines: 11, 
        length: 20,
        width: 10,
        radius:20
      }).spin(ld);
      Lollipop.open({
        content:ld,
        showCancelButton: false
      });
    }, 
    stop: function (){
      Lollipop.close(true);
    }
  }
});
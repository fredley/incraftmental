var main = {

onload : function(){

  buttons.init();
  inventory.init();

  window.setInterval(function(){main.tick()}, 1000);

  // $(window).bind('beforeunload', function(){
  //     return "Are you sure you want to leave?"
  // });
},

tick : function(){
  inventory.doTools();
  inventory.updateDisplay();
},

addAlert : function(text){
  $('#alerts').show();
  var alert = $("<div class='alert'>" + text + "</div>");
  $('#alerts').append(alert);
  setTimeout(function(){
    alert.fadeOut('slow',function(){
      $(this).remove();
      if($('#alerts .alert').length == 0){
        $('#alerts').hide();
      }
    });
  },3000);
}

};

window.onload = main.onload.bind(main);

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

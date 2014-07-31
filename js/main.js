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
  inventory.updateDisplay();
}

};

window.onload = main.onload.bind(main);

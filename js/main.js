var main = {

onload : function(){
  inventory.init();
  if('objects' in localStorage){
    inventory.objects = JSON.parse(localStorage['objects']);
  }
  if('villagers' in localStorage){
    villagers.population = JSON.parse(localStorage["villagers"]);
  }
  buttons.init();
  window.setInterval(function(){main.tick()}, 1000);
},

tick : function(){
  inventory.doTools();
  villagers.doVillagers();
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
},

addMouseAlert : function(text,e){
  var alert = $('<div class="mouse-alert"></div>');
  alert.html(text);
  alert.css({
    'left':e.pageX + 20,
    'top':e.pageY,
    'opacity':1
  });
  alert.animate({
    'top':e.pageY - 50,
    'opacity':0
  },1000,function(){
    alert.remove();
  });
  $('body').append(alert);
}

};

window.onload = main.onload.bind(main);

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChoice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

var main = {

ticks : 0,
villagers_visible: true,
inventory_visible: true,
map_visible: false,

onload : function(){
  inventory.init();
  villagers.init();
  buildings.init();
  this.load();
  settlements.init();
  world.init();
  buttons.init();
  window.setInterval(function(){main.tick()}, 1000);
},

tick : function(){
  inventory.doTools();
  villagers.doVillagers();
  settlements.doBuildings();
  inventory.updateDisplay();
  buttons.updateDisplay();
  var saveEvery = parseInt($('#autosave').val());
  if (saveEvery !== 0 && this.ticks % saveEvery == 0) {
  	this.save();
  }
  this.ticks++;
},

save : function(){
  var data = {'inventory':{},'villagers':[]};
  for(var group in inventory.objects){
    for(var object in inventory.objects[group]){
      data['inventory'][object] = {
        quantity : inventory.objects[group][object].quantity,
        hasOwned : inventory.objects[group][object].hasOwned
      }
    }
  }
  data["villagers"] = villagers.population;
  data["villager_cost"] = villagers.cost;
  data["world_seed"] = world.seed;
  data["settlements"] = settlements.occupied;
  data["smelt_rate"] = inventory.smelt_rate;
  data["structures"] = world.placed_structures;
  data["camX"] = world.camX;
  data["camY"] = world.camY;
  localStorage["save"] = JSON.stringify(data);
},

load : function(){
  if('save' in localStorage){
    var data = JSON.parse(localStorage['save']);
  }else{
    return;
  }
  for(var group in inventory.objects){
    for(var object in inventory.objects[group]){
      if(object in data['inventory']){
        inventory.objects[group][object].quantity = data.inventory[object].quantity;
        inventory.objects[group][object].hasOwned = data.inventory[object].hasOwned;
      }
    }
  }
  inventory.smelt_rate = data["smelt_rate"];
  villagers.population = data["villagers"];
  villagers.cost = (data["villager_cost"]) ? data["villager_cost"] : 1;
  settlements.occupied = data["settlements"];
  world.seed = data["world_seed"];
  world.camX = data["camX"];
  world.camY = data["camY"];
  world.placed_structures = data["structures"];
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
String.prototype.contains = function(s) {
    return this.indexOf(s) > -1;
}
String.prototype.formatAnMultiple = function(pluralCount) {
  var prefix = '';
  var postfix = '';
  if (pluralCount > 1){
    prefix = pluralCount + ' ';
    postfix = 's';
  }else{
    prefix = (['A','E','I','O','U'].indexOf(this[0]) > -1) ? 'an ' : 'a ';
  }
  return prefix + this + postfix;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChoice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

var settlements = {

  occupied : [],
  selected : null,

  generate : function(x,y,height,width){
    var name = this.generateName();
    while(this.nameUsed()){
      name = this.generateName(name);
    }
    this.occupied.push({
      name: name,
      x: x,
      y: y,
      height: height,
      width: width,
      buildings: []
    });
    return name;
  },

  generateName : function(){
    var starts = ['furl','middl','whel','till','rus','shin','red','fletch',
    'skaffer','caster','iron','wall','mine','notch','mole','tarn','strath',
    'stan','pen','feather','rose','guild','gold','hero','stir','ren','fen',
    'fir','low','pick','coal','creeper','jeb','yog','new','old','steve'];
    var ends = ['shire','ton','ford','bridge','berry','bost','combe','ington',
    'wood','cot','dean','firth','mouth','hurst','leigh','thorp','wick','worth',
    'brine','town','head','stead','holm','ham','ingshire','ing','ingford','ly',
    'rock','stone','turn','cross','mont','down','bury','tonbury','by','borough'];
    return (randomChoice(starts) + randomChoice(ends)).capitalize();
  },

  nameUsed : function(name){
    for(var i = 0; i < this.occupied.length; i++){
      if(this.occupied[i].name == name) return true;
    }
    return false;
  },

  addBuilding : function(settlement,building,x,y){
    this.occupied[settlement].buildings.push({building:building,x:x,y:y});
    buildings.build(building);
  },

  draw_buildings : function(settlement){
    for(var b in settlement.buildings){
      var obj = buildings.getBuilding(settlement.buildings[b].building);
      for(var i = 0; i < obj.width; i++){
        for(var j = 0; j < obj.height; j++){
          var el = $('.settlement-grid[data-x=' + (i + settlement.buildings[b].x) + '][data-y=' + (j + settlement.buildings[b].y) + ']');
          if(i == 0) el.addClass("left-edge");
          if(j == 0) el.addClass("top-edge");
          if(i == obj.width-1)  el.addClass("right-edge");
          if(j == obj.height-1) el.addClass("bottom-edge");
          el.html(obj.symbol);
        }
      }
    }
  },

  updateDisplay : function(){
    $('#settlement-list').html('');
    for(var i = 0; i < this.occupied.length; i++){
      var cls = (this.selected === i) ? 'selected' : '';
      $('#settlement-list').append('<div class="settlement item ' + cls + '" data-id=' + i + ' >' + this.occupied[i].name + '</div>');
    }
    if(this.selected !== null){
      this.draw(this.selected);
    }
    buttons.hook_settlements();
  },

  draw : function(id){
    $('#grid').html('');
    var s = this.occupied[id];
    for(var j = 0; j < s.height; j++){
      for(var i = 0; i < s.width; i++){
        var square = $('<div class="settlement-grid" data-x=' + i + ' data-y=' + j + '></div>');
        if(i==0) square.addClass('new-row');
        $('#grid').append(square);
      }
    }
    this.draw_buildings(s);
  },

  drawHover : function(x,y){
    this.noHover();
    if(buildings.selected === null) return;
    var b = buildings.getBuilding(buildings.selected);
    canBuild = true;
    for(var i = x; i < x + b.width; i++){
      for(var j = y; j < y + b.height; j++){
        var el = $('.settlement-grid[data-x=' + i + '][data-y=' + j + ']');
        if(el.length === 0){
          canBuild = false;
        }else{
          canBuild = canBuild && el.html() == "";
          el.addClass('grid-hover');
        }
      }
    }
    var cls = canBuild ? 'hover-green' : 'hover-red';
    $('.grid-hover').addClass(cls);
  },

  noHover : function(){
    $('.settlement-grid').removeClass('hover-green');
    $('.settlement-grid').removeClass('hover-red');
    $('.settlement-grid').removeClass('grid-hover');
  },

  init : function(){
    this.updateDisplay();
  },

  doBuildings : function(){
    if(Math.random() < 0.0001){
      //ZMOBIES!
      var index = Math.floor(Math.random() * this.occupied.length);
      var toDestroy = this.occupied[index];
      var hasChurch = 0;
      var hasBarracks = 0;
      for(var b in toDestroy.buildings){
        if(toDestroy.buildings[b].building == 'church'){
          hasChurch = 1;
        }
        if(toDestroy.buildings[b].building == 'barracks'){
          hasBarracks = 1;
        }
      }
      if(Math.random() > hasChurch * 0.5 && Math.random() > hasBarracks * 0.9){
        main.addAlert(toDestroy.name + ' was destroyed by zombies!');
        toDestroy.buildings = [];
        this.updateDisplay();
      }
    }
    for(var i = 0; i < this.occupied.length; i++){
      for(var b in this.occupied[i].buildings){
        var building = buildings.getBuilding(this.occupied[i].buildings[b].building);
        building.tick();
      }
    }
  }

};

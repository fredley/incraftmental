var settlements = {

  occupied : [],
  selected : null,

  generate : function(x,y,height,width){
    var name = this.generateName();
    while(this.nameUsed()){
      name = this.generateName(name);
    }
    return {
      name: name,
      x: x, // coordinates in the world
      y: y,
      height: height,
      width: width,
      buildings: [] // e.g. { type: 'house', x: 0, y: 0 }
    };
  },

  generateName : function(){
    var starts = ['furl','middl','whel','till','rus','shin','red','fletch','skaffer','caster','iron','wall','mine','notch','mole','tarn','strath','stan','pen','feather','rose','guild','gold','hero'];
    var ends = ['shire','ton','ford','ington','bridge','berry','bost','combe','wood','cot','dean','firth','mouth','hurst','leigh','thorp','wick','worth','brine','town','head','stead','holm','ham'];
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

  building_intersects : function(x,y,a,settlement){
    a.right  = x + a.width;
    a.bottom = y + a.height;
    for(var b in settlement.buildings){
      var building = buildings.getBuilding(slug);
      b.right  = b.x + building.width;
      b.bottom = b.y + building.height;
        if (a.x < b.right &&
            b.x < a.right &&
            a.y < b.bottom &&
            b.y < a.bottom) return true;
    }
    return false;
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

};

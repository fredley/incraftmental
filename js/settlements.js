var settlements = {

  occupied : [],

  generate : function(height,width){
    return {
      x: x, // coordinates in the world
      y: y,
      height: height,
      width: width,
      buildings: [] // e.g. { type: 'house', x: 0, y: 0 }
    };
  },

  addBuilding : function(settlement,building){
    this.occupied[settlement].buildings.push(building);
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

  draw_building : function(settlement,x,y){
    for(var b in settlement.buildings){
      var obj = buildings.getBuilding(b);
      for(var i = 0; i < obj.width; i++){
        for(var j = 0; j < obj.height; j++){
          $('.settlement-grid[data-x=' + (i + settlement.buildings[b].x) + '][data-y=' + (j + settlement.buildings[b].y) + ']').html(obj.symbol);
        }
      }
    }
  },

  draw : function(id){
    var s = this.occupied[id];
    for(var j = 0; j < s.y; j++){
      for(var i = 0; i < s.x; i++){
        var square = $('<div class="settlement-grid" data-x=' + i + ' data-y=' + j);
        if(i==0) square.addClass('new-row');
        square.html(this.draw_building(s,i,j));
        $('#grid').append(square);
      }
    }
  }

};

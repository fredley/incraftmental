var settlements = {

  occupied : [],

  generate : function(height,width){
    return {
      height: height,
      width: width,
      buildings: [] // e.g. { type: 'house', x: 0, y: 0 }
    };
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
  }

};

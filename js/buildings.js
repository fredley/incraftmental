var buildings = {

  selected: null,

  objects : {
    house        : { width: 2, height: 2,   symbol: 'H', houses: 0,  cost: {stone: 100,   cobble: 200,   plank: 400,   glass: 50 }},
    barn         : { width: 4, height: 8,   symbol: 'B', houses: 1,  cost: {stone: 100,   cobble: 800,   plank: 1000,  wood:  500}},
    mill         : { width: 6, height: 6,   symbol: 'M', houses: 1,  cost: {stone: 1000,  cobble: 500,   plank: 600,   wood:  300,  dirt: 5000}},
    church       : { width: 8, height: 4,   symbol: '^', houses: 2,  cost: {stone: 5000,  cobble: 1000,  plank:1000,   wood: 1000,  glass: 5000, gold_ingot: 100}},
    school       : { width: 6, height: 4,   symbol: 'S', houses: 2,  cost: {stone: 8000,  cobble: 1000,  plank:3000,   wood: 5000,  glass: 3000}},
    farm         : { width: 8, height: 8,   symbol: 'F', houses: 4,  cost: {stone: 1000,  cobble: 900,   plank:10000,  wood: 5000,  dirt: 50000, sand: 50000}},
    barracks     : { width: 8, height: 8,   symbol: 'X', houses: 4,  cost: {stone: 10000, cobble: 900,   plank:1000,   wood: 5000,  iron_ingot: 1000, gold_ingot: 1000}},
    mine         : { width: 8, height: 8,   symbol: 'O', houses: 8,  cost: {stone: 10000, cobble: 10000, plank:10000,  wood: 10000, iron_ingot: 5000}},
    factory      : { width: 10, height: 6,  symbol: 'F', houses: 8,  cost: {stone: 20000, cobble: 10000, plank:10000,  wood: 10000, iron_ingot: 10000, gold_ingot: 5000, redstone: 1000}},
    market       : { width: 10, height: 10, symbol: '$', houses: 12, cost: {stone: 80000, cobble: 20000, plank:100000, wood: 10000, glass: 50000, iron_ingot: 20000, gold_ingot: 30000, redstone: 5000}},
    university   : { width: 12, height: 10, symbol: 'U', houses: 16, cost: {stone: 100000,cobble: 80000, plank:120000, wood: 40000, glass: 80000, iron_ingot: 40000, gold_ingot: 80000, redstone: 10000}},
  },

  canBuild : function(slug, settlement){
    for(var object in this.objects[slug].cost){
      if(inventory.getObject(object).quantity < this.objects[slug].cost[object]){
        return [false, 'Not enough ' + inventory.getObject(object).display];
      }
    }
    var houses = 0;
    for(var b in settlement.buildings){
      var building = settlement.buildings[b].building;
      if(building === 'house'){
        houses++;
      }else{
        houses -= this.objects[building].houses;
      }
    }
    if(this.objects[slug].houses > houses) return [false, 'Not enough houses'];
    return [true,""];
  },

  getBuilding : function(slug){
    return this.objects[slug];
  },

  build : function(slug){
    main.addAlert('Built a new ' + slug.capitalize());
    switch(slug){
      case 'house':
        villagers.addVillager();
        main.addAlert('You got a new villager!');
        break;
    }
  },

  init : function(){
    for(var b in this.objects){
      var building = this.getBuilding(b);
      var el = $('<div class="building item" data-object="' + b + '">' + b.capitalize() + '</div>');
      var requirements = $('<div class="requirements"></div>');
      el.append(requirements);
      requirements.append('<div class="requirement">Houses: ' + building.houses + '</div>');
      for(var o in building.cost){
        requirements.append('<div class="requirement">' + inventory.getObject(o).display + ': ' + building.cost[o] + '</div>');
      }
      $('#buildings-list').append(el);
    }
  }

};

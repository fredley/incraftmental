var buildings = {

  selected: null,

  objects : {
    house        : { width: 2, height: 2,   symbol: 'H', houses: 0,  cost: {stone: 100,   cobble: 200,   plank: 400,   glass: 50 },
                    description: 'Gives you a villager. Required for other structures.',
                    tick : function(){}},
    blacksmith   : {width: 4, height: 4,   symbol: '*', houses: 2,  cost: {stone: 500,   cobble: 10000,   plank: 1000,  wood:  1000},
                    description: 'Speeds up your furnace.',
                    tick : function(){}},
    mill         : { width: 4, height: 8,   symbol: 'B', houses: 1,  cost: {stone: 100,   cobble: 800,   plank: 1000,  wood:  500},
                    description: 'Mills wheat into flour.',
                    tick : function(){
                      if(inventory.objects.items.seeds.quantity > 100){
                        inventory.addObject('wheat',-100);
                        inventory.addObject('flour',40);
                      }
                    }},
    bakery       : { width: 6, height: 6,   symbol: 'M', houses: 1,  cost: {stone: 1000,  cobble: 500,   plank: 600,   wood:  300,  dirt: 5000},
                    description: 'Bakes flour into bread.',
                    tick : function(){
                      if(inventory.objects.items.wheat.quantity > 100){
                        inventory.addObject('flour',-100);
                        inventory.addObject('bread',40);
                      }
                    }},
    church       : { width: 8, height: 4,   symbol: '^', houses: 2,  cost: {stone: 5000,  cobble: 1000,  plank:1000,   wood: 1000,  glass: 5000, gold_ingot: 100},
                    description: 'Helps prevent zombie attacks.',
                    tick : function(){}},
    school       : { width: 6, height: 4,   symbol: 'S', houses: 2,  cost: {stone: 8000,  cobble: 1000,  plank:3000,   wood: 5000,  glass: 3000},
                    description: 'Levels up your villagers.',
                    tick : function(){
                      // upgrade some villagers to max. level 3
                      if(Math.random() < 0.001){
                        var elligible = [];
                        for(var i in villagers.population){
                          if(villagers.population[i].level < 3 && villagers.population[i].profession){
                            elligible.push(i);
                          }
                        }
                        if(elligible.length > 1){
                          villagers.population[randomChoice(elligible)].level++;
                          main.addAlert('One of your villagers was upgraded at school!');
                        }
                      }
                    }},
    farm         : { width: 8, height: 8,   symbol: 'F', houses: 4,  cost: {stone: 1000,  cobble: 900,   plank:10000,  wood: 5000,  dirt: 50000, sand: 5000, bonemeal: 500},
                    description: 'Gives large amounts of wheat.',
                    tick : function(){
                      inventory.objects.items.wheat.quantity += 100;
                    }},
    barracks     : { width: 8, height: 8,   symbol: 'X', houses: 4,  cost: {stone: 10000, cobble: 900,   plank:1000,   wood: 5000,  iron_ingot: 1000, gold_ingot: 1000},
                    description: 'Prevents zombie attacks almost completely.',
                    tick : function(){}},
    mine         : { width: 8, height: 8,   symbol: 'O', houses: 8,  cost: {stone: 10000, cobble: 10000, plank:10000,  wood: 10000, iron_ingot: 5000},
                    description: 'Gives you large quantities of minerals.',
                    tick : function(){
                      for(var slug in this.objects.tools['diamond_pick'].gives){
                        if(Math.random() < this.objects.tools['diamond_pick'].gives[slug]){
                          inventory.addObject(slug,this.objects.tools[tool].bonus * this.objects.tools[tool].quantity * 100);
                        }
                      }
                    }},
    factory      : { width: 10, height: 6,  symbol: 'F', houses: 8,  cost: {stone: 20000, cobble: 10000, plank:10000,  wood: 10000, iron_ingot: 10000, gold_ingot: 5000, redstone: 1000},
                    description: 'TODO',
                    tick : function(){ /*TODO*/ }},
    market       : { width: 10, height: 10, symbol: '$', houses: 12, cost: {stone: 80000, cobble: 20000, plank:100000, wood: 10000, glass: 50000, iron_ingot: 20000, gold_ingot: 30000, redstone: 5000},
                    description: 'TODO',
                    tick : function(){ /*TODO*/ }},
    university   : { width: 12, height: 10, symbol: 'U', houses: 16, cost: {stone: 100000,cobble: 80000, plank:120000, wood: 40000, glass: 80000, iron_ingot: 40000, gold_ingot: 80000, redstone: 10000},
                    description: 'Levels up your villagers even more.',
                    tick : function(){
                     // upgrade some villagers to max. level 5
                      if(Math.random() < 0.001){
                        var elligible = [];
                        for(var i in villagers.population){
                          if(villagers.population[i].level < 5 && villagers.population[i].profession){
                            elligible.push(i);
                          }
                        }
                      }
                      villagers.population[randomChoice(elligible)].level++;
                      main.addAlert('One of your villagers was upgraded at university!');
                    }},
    canteen      : { width: 4, height: 4, symbol: 'C', houses: 1, cost: {stone: 1000, cobble: 20000, plank:10000, wood: 10000, glass: 500},
                    description: 'Cooks food for you.',
                    tick : function(){
                      for(var group in inventory.objects){
                        for(var object in inventory.objects[group]){
                          var o = inventory.objects[group][object];
                          if(o.cooks_to && o.quantity >= 10){
                            inventory.addObject(object,-10);
                            inventory.addObject(o.cooks_to,10);
                          }
                        }
                      }
                    }},
    orchard      : { width: 8, height: 8, symbol: 'T', houses: 4, cost: {stone: 4000, cobble: 20000, plank:1000, wood: 100000, glass: 500, dirt: 10000, bonemeal: 500},
                    description: 'Gives large amounts of wood.',
                    tick : function(){
                      for(var slug in this.objects.tools['diamond_axe'].gives){
                        if(Math.random() < this.objects.tools['diamond_axe'].gives[slug]){
                          inventory.addObject(slug,this.objects.tools[tool].bonus * this.objects.tools[tool].quantity * 100);
                        }
                      }
                    }},
    pig_sty      : { width: 8, height: 4, symbol: 'P', houses: 2, cost: {stone: 4000, cobble: 20000, plank:10000, wood: 10000, glass: 500, dirt: 50000, apple: 1000},
                    description: 'Gives large amounts of pork.',
                    tick : function(){
                      inventory.addObject('porkchop',10);
                    }},
    kennel       : { width: 2, height: 2, symbol: 'K', houses: 1, cost: {cobble: 2000, plank:1000, wood: 1000, glass: 500},
                    description: 'Gives you dogs to help in combat.',
                    tick : function(){}},
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
    var building = this.getBuilding(slug);
    for(item in building.cost){
      inventory.addObject(item,-1 * building.cost[item]);
    }
    main.addAlert('Built a new ' + slug.capitalize());
    switch(slug){
      case 'house':
        villagers.addVillager();
        main.addAlert('You got a new villager!');
        break;
      case 'blacksmith':
        inventory.smelt_rate = inventory.smelt_rate * 0.75;
        break;
      case 'kennel':
        combat.hasDog = true;
        break;
    }
  },

  init : function(){
    for(var b in this.objects){
      var building = this.getBuilding(b);
      var el = $('<div class="building item" data-object="' + b + '">' + b.capitalize() + '</div>');
      var requirements = $('<div class="requirements"></div>');
      el.append(requirements);
      requirements.append('<div class="description">' + building.description + '</div>');
      requirements.append('<div class="requirement">Houses: ' + building.houses + '</div>');
      requirements.append('<div class="requirement">Size: ' + building.width + ' x ' + building.height + '</div>');
      for(var o in building.cost){
        requirements.append('<div class="requirement">' + inventory.getObject(o).display + ': ' + building.cost[o] + '</div>');
      }
      $('#buildings-list').append(el);
    }
  }

};

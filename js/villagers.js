var villagers = {

  population : [],
  cost : 1,
  food_value: 5,

  professions : {
    smith : function(villager){
      var object = inventory.getObject(villager.assigned);
      if(object.quantity >= 10){
        inventory.addObject(villager.assigned,-10);
        inventory.addObject(object.smelts_to,2);
      }
    },
    builder : function(villager){
      if(inventory.canCraft(villager.assigned)){
        inventory.craft(villager.assigned);
      }
    },
    chef : function(villager){
      // cook better(?) foods
      var food = inventory.getObject(villager.assigned);
      if(food.cooked_from){
        var from = inventory.getObject(food.cooked_from);
        if(from.quantity >= 1){
          inventory.addObject(villager.assigned,1);
          inventory.addObject(food.cooked_from,-1);
        }
      }else{
        if(inventory.canCraft(villager.assigned)){
          inventory.craft(villager.assigned);
        }
      }
    },
    adventurer : function(villager){
      // gets certain mob items faster
      inventory.addObject(villager.assigned,randomInt(1,4));
    },
    labourer : function(villager){
      // assigned a tool, makes that tool much more powerful
      var tool = inventory.getObject(villager.assigned);
      for(var slug in tool.gives){
        if(Math.random() / 5 < tool.gives[slug]){
          inventory.addObject(slug,tool.bonus * 15);
        }
      }

    },
    fisher : function(villager){
      // fish better fish
    },
    hunter : function(villager){
      //not sure yet...
    }
  },

  levels : {
    1 : 'Novice',
    2 : 'Apprentice',
    3 : '',
    4 : 'Master',
    5 : 'Supreme'
  },

  init : function(){
	this.population = [];
	this.cost = 1;
  },

  addVillager : function(){
    var name = this.generateName();
    while(this.population.indexOf(name) > -1){
      name = this.generateName(); // nobody's ever going to have enough villagers for this to be a problem, right?
    }
    this.population.push({
      'name' : name,
      'profession' : null,
      'level' : 0,
      'enabled': false,
      'assigned': null,
      'actions': 0,
      'hunger': 10
    });
    this.updateDisplay();
  },

  generateName : function(){
    var name = "";
    var vowels = ["a","e","i","o","u"];
    var consonants = ["b","ch","d","f","g","h","sk","l","m","n","p","r","s","fl","t","th","v","z"];
    var length = randomInt(3,5);
    for(var i=0; i<=length; i++){
        name += (i % 2 == 0) ? randomChoice(consonants) : randomChoice(vowels);
    }
    return name.capitalize();
  },

  assignProfession : function(id, profession, level){
    this.population[id].profession = profession;
    this.population[id].level = level;
    this.population[id].enabled = true;
    this.population[id].assigned = null;
    this.updateDisplay();
  },

  assignObject : function(id,block){
    this.population[id].assigned = block;
    this.updateDisplay();
  },

  doVillagers : function(){
    for(var i=0; i<this.population.length; i++){
      var v = this.population[i];
      if(v.profession && v.enabled && v.assigned && Math.random() < 0.2 * v.level){
        v.hunger = Math.max(0,v.hunger-1);
        if(v.hunger === 0){
          //try and eat, else skip
          var foods = [];
          for(var group in inventory.objects){
            for(var object in inventory.objects[group]){
              if(inventory.objects[group][object].food > 0 && inventory.objects[group][object].quantity >= 10){
                foods.push([object,inventory.objects[group][object].food]);
              }
            }
          }
          if(foods.length == 0){
            continue;
          }else{
            var toEat = randomChoice(foods);
            inventory.addObject(toEat[0],-10);
            v.hunger = toEat[1] * this.food_value;
          }
        }
        v.actions++;
        if(v.actions > (250 * Math.pow(2,v.level)) && v.level <= 5){
          v.actions = 0;
          v.level++;
          main.addAlert(v.name + ' gained a level!');
        }
        this.professions[v.profession](v);
      }
    }
    this.updateDisplay();
  },

  updateDisplay : function(){
    if(!main.villagers_visible) return;
    var villagerText = "<h3>Villagers</h3>"
    var hungry = false;
    for(villager in this.population){
      var v = this.population[villager];
      villagerText += '<div class="item villager';
      villagerText += v.hunger == 0 ? ' hungry' : '';
      hungry = hungry || v.hunger == 0;
      villagerText += '" data-id="' + villager + '"><span class="pause" data-id="' + villager + '">';
      villagerText += (v.enabled) ? '*' : '>';
      villagerText += '</span> ' + v.name.capitalize();
      if(v.level > 0){
        villagerText += ' the ' + this.levels[v.level] + ' ' + v.profession.capitalize();
      }
      if(v.profession){
        villagerText += (v.assigned) ? ' (' + inventory.getObject(v.assigned).display + ')' : ' (unassigned)';
      }
      villagerText += '</div>';
    }
    if(hungry) villagerText += '<div class="hunger-warning">One of your villagers is hungry! Get 10 of any food item and they\'ll carry on working.</div>';
    $('#villagers').html(villagerText);
    if(this.population.length > 0){
      $('#villagers').show();
    }
    buttons.hook_villagers();
  }

};

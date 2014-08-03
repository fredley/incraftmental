var villagers = {

  population : [],
  cost : 1,

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
          inventory.addObject(slug,tool.bonus);
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
      'assigned': null
    });
    this.updateDisplay();
  },

  generateName : function(){
    var name = "";
    var vowels = ["a","e","i","o","u"];
    var consonants = ["b","ch","d","f","g","h","k","l","m","n","p","r","s","sh","t","th","v","z"];
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
      if(v.profession && v.enabled && v.assigned && Math.random() < Math.pow(0.2 * v.level,2)){
        this.professions[v.profession](v);
      }
    }
    this.updateDisplay();
  },

  updateDisplay : function(){
    if(!main.sidebars_visible) return;
    var villagerText = "<h3>Villagers</h3>";
    for(villager in this.population){
      var v = this.population[villager];
      villagerText += '<div class="item villager" data-id="' + villager + '"><span class="pause" data-id="' + villager + '">';
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
    $('#villagers').html(villagerText);
    if(this.population.length > 0){
      $('#villagers').show();
    }
    buttons.hook_villagers();
  }

};

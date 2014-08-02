var villagers = {

  population : [],
  cost : 1,

  professions : {
    smith : function(villager){
      if(!villager.assigned) return;
      var object = inventory.getObject(villager.assigned);
      var quantity = Math.min(villager.level,object.quantity);
      inventory.addObject(villager.assigned,quantity);
      inventory.addObject(object.smelts_to,quantity);
    },
    builder : function(villager){
      if(!villager.assigned) return;
      for(var i=0; i < villager.level; i++){
        if(inventory.canCraft(villager.assigned)){
          inventory.craft(villager.assigned);
        }
      }
    },
    farmer : function(villager){
      // find a growable and grow
    },
    adventurer : function(villager){
      // find a droppable and drop
    },
    digger : function(villager){
      // not sure yet...
    },
    fisher : function(villager){
      // fish fish
    },
    archer : function(villager){
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
      'enabled': true,
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
    this.updateDisplay();
  },

  assignObject : function(id,block){
    this.population[id].assigned = block;
    this.updateDisplay();
  },

  doVillagers : function(){
    for(var i=0; i<this.population.length; i++){
      var v = this.population[i];
      if(v.profession && v.enabled && v.assigned){
        this.professions[v.profession](v);
      }
    }
    this.updateDisplay();
  },

  updateDisplay : function(){
    var villagerText = "<h3>Villagers</h3>";
    for(villager in this.population){
      var v = this.population[villager];
      villagerText += '<div class="villager" data-id="' + villager + '"><span class="pause" data-id="' + villager + '">';
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

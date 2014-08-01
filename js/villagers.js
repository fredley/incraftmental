var villagers = {

  population : [],

  professions : {
    smith : function(level){
      // find a smeltable and smelt
    },
    builder : function(level){
      craftables = [];
      for(var group in inventory.objects){
        for(var object in inventory.objects[group]){
          var o = inventory.objects[group][object];
          if(o.recipe && o.hasOwned && inventory.canCraft(object)){ // only build things that have been built before
            craftables.push(object);
          }
        }
      }
      if(craftables.length > 0){
        for(var i=0; i < level; i++){
          var craftable = randomChoice(craftables);
          if(inventory.canCraft(craftable)){
            inventory.craft(craftable);
          }
        }
      }
    },
    farmer : function(level){
      // find a growable and grow
    },
    adventurer : function(level){
      // find a droppable and drop
    },
    digger : function(level){
      // not sure yet...
    },
    fisher : function(level){
      // fish fish
    },
    archer : function(level){
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
      'enabled': true
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

  assignVillager : function(id, profession, level){
    this.population[id].profession = profession;
    this.population[id].level = level;
    this.updateDisplay();
  },

  doVillagers : function(){
    for(var i=0; i<this.population.length; i++){
      if(this.population[i].profession && this.population[i].enabled){
        this.professions[this.population[i].profession](this.population[i].level);
      }
    }
    this.updateDisplay();
  },

  updateDisplay : function(){
    var villagerText = "<h3>Villagers</h3>";
    for(villager in this.population){
      villagerText += '<div class="villager" data-id="' + villager + '"><span class="pause" data-id="' + villager + '">*</span> ' + this.population[villager].name.capitalize();
      if(this.population[villager].level > 0){
        villagerText += ' the ' + this.levels[this.population[villager].level] + ' ' + this.population[villager].profession.capitalize();
      }
      villagerText += (this.population[villager].enabled) ? '' : ' (paused)';
      villagerText += '</div>';
    }
    $('#villagers').html(villagerText);
    if(this.population.length > 0){
      $('#villagers').show();
    }
    buttons.hook_villagers();
    localStorage["villagers"] = JSON.stringify(this.population);
  }

};

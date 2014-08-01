var villagers = {

  population : [],

  professions : {
    smith : function(level){
      // find a smeltable and smelt
    },
    builder : function(level){
      // find a craftable and craft
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
      'level' : 0
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

  assignVillager : function(name, profession, level){
    this.population[name].profession = profession;
    this.population[name].level = level;
    this.updateDisplay();
  },

  doVillagers : function(){
    for(var i=0; i<this.population.length; i++){
      this.professions[this.population[i].profession](this.population[i].level);
    }
    this.updateDisplay();
  },

  updateDisplay : function(){
    var villagerText = "<h3>Villagers</h3>";
    for(villager in this.population){
      villagerText += '<div class="villager">' + this.population[villager].name.capitalize();
      if(this.population[villager].level > 0){
        villagerText += ' the ' + this.levels[this.population[villager].level] + ' ' + this.population[villager].profession.capitalize();
      }
      villagerText += '</div>';
    }
    $('#villagers').html(villagerText);
    localStorage["villagers"] = JSON.stringify(this.population);
  }

};

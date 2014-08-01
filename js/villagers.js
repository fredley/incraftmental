var villagers = {

  population : [],

  addVillager : function(){
    var name = this.generateName();
    while(!(name in this.population)){
      name = generateName(); // nobody's ever going to have enough villagers for this to be a problem, right?
    }
    population.push({
      'name' : name,
      'profession' : null
    });
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
  }

};

var adventure = {

  inAdventure: false,
  escapeCode: '',
  attemptCode: '',
  name: '',
  lastAction: '',
  danger: 0,

  startAdventure: function(name,danger){
    this.inAdventure = true;
    this.danger = danger;
    this.attemptCode = '';
    this.name = name;
    this.lastAction = 'You find yourself in a ' + world.gen_structures[name].display + ', at a fork in the path. Which way do you go?';
    this.generateEscapeCode();
    this.draw();
  },

  generateEscapeCode: function(){
    var length = Math.floor(Math.random() * 3) + 2;
    this.escapeCode = '';
    for(var i = 0;i < length; i++){
        this.escapeCode += randomChoice(['L','R','F']);
    }
  },

  go: function(code){
    this.attemptCode += code;
    if(this.attemptCode === this.escapeCode) this.escape();
    if(this.escapeCode.indexOf(this.attemptCode) !== 0) this.attemptCode = '';
    switch(code){
      case 'L':
        this.lastAction = "You turn left";
        break;
      case 'R':
        this.lastAction = "You turn right";
        break;
      case 'F':
        this.lastAction = "You carry straight on";
        break;
    }
    if(Math.random() < 0.5){
        combat.startCombat(this.danger);
        this.lastAction += ", and having defeated your foe, come to a fork in the path. Which way do you go?";
        return;
    }
    this.lastAction += ", and find yourself at a fork in the path. Which way do you go?";
    this.draw();
  },

  wonFight: function(){
    this.draw();
  },

  escape: function(){
    console.log('escaped!');
    this.inAdventure = false;
    this.lastAction = "You manage to find the exit!";
    if(this.name === 'settlement'){
      var name = settlements.generate();
      this.lastAction += " You decide to name your new settlement " + name + ".";
      main.addAlert("You founded a new settlement!");
    }
    this.draw();
  },

  draw: function(){
    main.showPopup('adventure');
    el = $('#shade .adventure');
    el.find('.adventure-name').html(this.name);
    el.find('.adventure-text').html(this.lastAction);
    if(this.inAdventure){
      $('.adventure_move').removeClass('disabled');
      buttons.hook_adventure();
    }else{
      $('.adventure_move').addClass('disabled');
    }
  }
};
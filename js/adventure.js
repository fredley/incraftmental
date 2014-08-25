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
    if(this.attemptCode === this.escapeCode){
      this.escape();
      return;
    }
    if(this.escapeCode.indexOf(this.attemptCode) !== 0){
      this.attemptCode = (this.escapeCode.indexOf(code) === 0) ? code : '';
    }
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

  lostFight: function(){
    this.inAdventure = false;
  },

  escape: function(){
    this.inAdventure = false;
    this.lastAction = "You manage to find the exit!";
    if(this.name === 'settlement'){
      var size = Math.min(16,2 * world.distance());
      var name = settlements.generate(size);
      this.lastAction += " You decide to name your new settlement " + name + ".";
      main.addAlert("You founded a new settlement!");
    }else{
      this.lastAction += " You found an emerald on the way out!";
      main.addAlert("You found an emerald!");
      inventory.addObject('emerald',1);
    }
    this.draw();
  },

  draw: function(){
    main.showPopup('adventure');
    el = $('#shade .adventure');
    el.find('.adventure-name').html(this.name);
    el.find('.adventure-text').html(this.lastAction);
    if(this.inAdventure){
      el.find('.move_adventure').removeClass('disabled');
    }else{
      el.find('.move_adventure').addClass('disabled');
      el.find('.close-button').show();
    }
    buttons.hook_adventure();
  }
};
var combat = {
  inCombat : false,
  hp: 20,
  maxhp: 20,
  mobhp: 0,
  // TODO
  fighting: null, // save this, so that quitting during a fight is a disadvantage
  canAttack: true,
  mobAttack: null,

  mobs : {
    zombie:   { hp: 10, attack: 1 },
    skeleton: { hp: 15, attack: 2 },
    spider:   { hp: 10, attack: 3 },
    enderman: { hp: 20, attack: 5 },
  },

  getMob: function (danger) {
    var roll = Math.random();
    roll += danger * 0.1;
    if (roll < 0.5) {
      return 'zombie';
    }else if(roll < 1){
      return 'skeleton';
    }else if(roll < 1.1){
      return 'spider';
    }else{
      return 'enderman';
    }
  },

  getAttack: function(){
    if(inventory.objects.tools.diamond_sword.quantity > 0) return 5;
    if(inventory.objects.tools.gold_sword.quantity > 0)    return 4;
    if(inventory.objects.tools.iron_sword.quantity > 0)    return 3;
    if(inventory.objects.tools.stone_sword.quantity > 0)   return 2;
    if(inventory.objects.tools.wooden_sword.quantity > 0)  return 1;
    return 0;
  },

  getDefence: function(){
    var classes = ['leather','iron','gold','diamond'];
    var types = ['helmet','leggings','chest','boots'];
    var value = 0;
    for (type in types){
      var pieceValue = 0;
      for(cls in classes){
        pieceValue = (inventory.objects.armour[classes[cls] + '_' + types[type]].quantity > 0) ? cls + 1 : pieceValue;
      }
      value += pieceValue;
    }
    return value;
  },

  reduceDamage: function(d){
    return Math.round(d - this.getDefence() / 10);
  },

  draw: function (el){
    if(typeof(el) === 'undefined') el = $('#shade .encounter');
    var mob = this.mobs[this.fighting];
    el.find('.mob-name').html(this.fighting.capitalize());
    el.find('.hp').html(this.hp + '/' + this.maxhp);
    el.find('.attack').html(this.getAttack());
    el.find('.mob-hp').html(this.mobhp + '/' + mob.hp);
    el.find('.mob-attack').html(mob.attack);
    if(inventory.objects.tools.bow.quantity > 0){
      el.find('.fight-ranged').show();
    }
  },

  startCombat: function (danger) {
    console.log('start combat');
    this.inCombat = true;
    this.fighting = this.getMob(danger);
    this.mobhp = this.mobs[this.fighting].hp;
    this.draw($('#popups .encounter'));
    main.showPopup('encounter');
    buttons.hook_encounter();
    this.mobAttack = setInterval(function(){
      var mob = combat.mobs[combat.fighting];
      combat.hp = Math.max(0,combat.hp - mob.attack);
      combat.logMessage('The ' + combat.fighting.capitalize() + ' hit you for ' + combat.reduceDamage(mob.attack) + ' points');
      if(combat.hp == 0){
        combat.lose();
        return;
      }
      combat.draw();
    },600);
  },

  endCombat: function (){
    this.inCombat = false;
    this.fighting = null;
    $('#popup .fight').addClass('disabled');
    $('#popup .run').addClass('disabled');
    clearInterval(this.mobAttack);
  },

  logMessage: function(msg){
    $('#popup .combat-log').append('<div class="msg">' + msg + '</div>');
    $('#popup .msg').animate({'top':'-=20'},100,function(){});
  },

  fight: function(ranged){
    var attack = (ranged) ? 1 : this.getAttack();
    if(this.canAttack){
      if(attack == 0){
        this.logMessage("Without a sword you do no damage to the " + this.fighting.capitalize());
      }else{
        this.mobhp = Math.max(0, this.mobhp - attack);
        this.logMessage('You hit the ' + this.fighting.capitalize() + ' for ' + attack + ' points');
      }
      if(this.mobhp == 0){
        this.win();
        return;
      }
      this.canAttack = false;
      setTimeout(function(){ combat.canAttack = true; },300);
      this.draw();
    }
  },

  run: function(){
    this.hp = Math.max(0,this.mobs[this.fighting].attack * 2);
    if(this.hp == 0){
      this.lose();
      return;
    }
    this.endCombat();
  },

  win: function(){
    combat.logMessage('You won the fight!');
    this.endCombat();
  },

  lose: function(){
    combat.logMessage('You lost the fight!');
    this.endCombat();
    world.camX = 0;
    world.camY = 0;
    this.hp = this.maxhp;
    world.draw();
  },

  unlocked: function(){
    return inventory.objects.tools.wooden_sword.hasOwned ||
           inventory.objects.tools.stone_sword.hasOwned ||
           inventory.objects.tools.iron_sword.hasOwned ||
           inventory.objects.tools.gold_sword.hasOwned ||
           inventory.objects.tools.diamond_sword.hasOwned;
  },

};

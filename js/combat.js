var combat = {
  inCombat : false,
  hp: 20,
  maxhp: 20,
  mobhp: 0,
  attack: 1,
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

  draw: function (el){
    if(typeof(el) === 'undefined') el = $('#shade .encounter');
    var mob = this.mobs[this.fighting];
    el.find('.mob-name').html(this.fighting.capitalize());
    el.find('.hp').html(this.hp + '/' + this.maxhp);
    el.find('.attack').html(this.attack);
    el.find('.mob-hp').html(this.mobhp + '/' + mob.hp);
    el.find('.mob-attack').html(mob.attack);
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
      combat.logMessage('The ' + combat.fighting.capitalize() + ' hit you for ' + mob.attack + ' points');
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

  fight: function(){
    if(this.canAttack){
      this.mobhp = Math.max(0, this.mobhp - this.attack);
      this.logMessage('You hit the ' + this.fighting.capitalize() + ' for ' + this.attack + ' points');
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
  },

};

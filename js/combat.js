var combat = {
  inCombat : false,
  
  mobs : {
    zombie:   { hp: 10, attack: 1 },
    skeleton: { hp: 15, attack: 2 },
    spider:   { hp: 10, attack: 3 },
    enderman: { hp: 20, attack: 5 },
  },
  
  getMob: function () {
    var roll = Math.random();
    if (roll < 0.4) {
      return this.mobs.zombie;
    }else if(roll < 0.8){
      return this.mobs.skeleton;
    }else if(roll < 0.95){
      return this.mobs.spider;
    }else{
      return this.mobs.enderman;
    }
  },
  
  startCombat: function () {
    
  }
  
};
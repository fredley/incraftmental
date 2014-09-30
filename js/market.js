var market = {
  baseRate : 0.9,

  prices : {},

  trade : function(from,to,quantity){
    var fromObj = inventory.getObject(from);
    if(fromObj.quantity < quantity) return false;
    inventory.addItem(from,-1 * quantity);
    inventory.addItem(to,quantity * baseRate * this.getPrice(to));
    this.bumpPrice(to);
  },

  getPrice : function(o){
    if(o in this.prices) return this.prices[o];
    this.prices[o] = this.baseRate;
    return this.baseRate;
  },

  bumpPrice : function(o){
    if(o in this.prices){
      this.prices[o] -= 0.1;
    }else{
      this.prices[o] = this.baseRate - 0.1;
    }
  },

};
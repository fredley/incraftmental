var trading = {
  rates: {},
  ticker: 0,
  updateEvery: 30,

  getRate: function(a,b){
    if(a+'_'+b in this.rates){
      return this.rates[a+'_'+b];
    }else{
      this.rates[a+'_'+b] = 50;
      this.rates[b+'_'+a] = 50;
    }
  },

  trade: function(a,b,n){
    n = (n) ? n : 1;
    var rate = this.getRate(a,b);
    inventory.addObject(a,-100 * n);
    inventory.addObject(b,rate * n);
    this.rates[a+'_'+b] -= n;
    this.rates[b+'_'+a] += n;
  },

  showPopup: function(){
    for(var group in inventory.objects){
      for(var object in inventory.objects[group]){
        var o = inventory.getObject(object);
        if(o.value){
          $('.trade-pane').append('<div class="inventory-item item" data-object="' + object + '">' + o.display + '</div>');
        }
      }
    }
    main.showPopup('trading');
  },

  tick: function(){
    if(ticker > updateEvery){
      for(rate in this.rates){
        if(this.rates[rate] < 50) this.rates++;
        if(this.rates[rate] > 50) this.rates--;
      }
      ticker = 0;
    }
  }
};
var world = {
  seed: 0,
  world_structures: {},
  camX: 0,
  camY: 0,
  posX: 20,
  posY: 15,
  relX: 0,
  relY: 0,
  size: 40,
  spawnX: 0,
  spawnY: 0,
  t: 0,
  color_dark: '#333', 
  color_light:'#ddd',
  color_green:'#285',
  grass_colors:['#285','#582','#592','#295','#4a6','#6a4'],
  grass_symbols:['.', ',', '\'', '`'],

  danger: 0,
  isMoving: false,
  isMining: false,

  structures:{
    home:       {display:'Home',       symbol: 'H', color: '#0f0', heals: true},
    settlement: {display:'Settlement', symbol: 'H', color: '#0ff', heals: true},
    wall:       {display:'Wall',       symbol: 'X', color: '#666'},
    water:      {display:'Water',      symbol: '~', color: '#55f'},
    torch:      {display:'Torch',      symbol: 'i', color: '#ff0'},
    mine:       {display:'Mine',       symbol: ' ', color: '#eee'},
    cave:       {display:'Cave',       symbol: 'o', color: '#9f9'},
    ruin:       {display:'Ruin',       symbol: '#', color: '#9f6'},
  },

  gen_structures: {
    cave:       {slug:'cave',       display:'Dark Cave',            symbol: 'o', color: '#a99', danger:1},
    ruin:       {slug:'ruin',       display:'Spooky Ruin',          symbol: '#', color: '#f94', danger:2},
    settlement: {slug:'settlement', display:'Abandoned Settlement', symbol: 'H', color: '#f33', danger:3},
  },

  placed_structures: {},

  distance: function(){
    return Math.floor(Math.sqrt(this.camX * this.camX + this.camY * this.camY) / 10);
  },

  calculateDanger: function(x, y){
    var x2 = (x+this.camX) - this.size/2;
    var y2 = (y+this.camY) - this.size/2;
    return Math.min(4,Math.floor(Math.sqrt(x2 * x2 + y2 * y2) / 10));
  },

  blockAt: function(rX,rY){
    var block = this.world_structures[(this.posX + parseInt(rX)) + '_' + (this.posY + parseInt(rY))];
    return (typeof(block) === 'undefined') ? false : block;
  },

  canMove: function(rX,rY){
    var struct = this.blockAt(rX,rY);
    if (struct && ['X','~'].indexOf(struct.symbol) > -1){
      return false;
    }
    return true;
  },

  build: function(){
    this.blocked = [0,0,0,0];
    this.world_structures={};
    for (var y = 0; y < this.size; y++){
      for (var x = 0; x < this.size; x++){
        var danger = this.calculateDanger(x,y);
        if(x == this.posX && y == this.posY){
          this.danger = danger;
        }
        if((x - this.posX + this.camX) == 0 && (y - this.posY + this.camY) == 0){
          this.world_structures[x + '_' + y] = this.structures['home'];
          continue;
        }
        var key = (this.posX - x - this.camX) + '_' + (this.posY - y - this.camY);
        if(key in this.placed_structures){
          this.world_structures[x + '_' + y] = this.structures[this.placed_structures[key]];
          continue;
        }
        var noise_value = Math.abs(noise.simplex2((x+this.camX)/20,(y+this.camY)/20));
        var struct_noise= Math.abs(noise.simplex2((x+this.camX),(y+this.camY)));
        if(struct_noise > 0.95){
          var struct = this.gen_structures[Object.keys(this.gen_structures)[Math.floor((noise_value * 10000) % Object.keys(this.gen_structures).length)]];
          this.world_structures[x + '_' + y] = struct;
          continue;
        }
        if(noise_value < 0.2 * Math.min(danger,1)){
          this.world_structures[x + '_' + y] = this.structures['wall'];
          continue;
        }
        if (noise_value > 0.6 && noise_value < 0.9){
          var grass = {
            color:  this.grass_colors[Math.floor(Math.abs(noise.simplex2((y+this.camY)/5,(x+this.camX)/5)) * this.grass_colors.length)],
            symbol: this.grass_symbols[Math.floor(Math.abs(noise.simplex2((y+this.camY)/5,(x+this.camX)/5)) * this.grass_symbols.length)]
          };
          this.world_structures[x + '_' + y] = grass;
        }
        if(noise_value >= 0.9){
          this.world_structures[x + '_' + y] = this.structures['water'];
        }
      }
    }
  },

  init: function(){
    if(this.seed === undefined || this.seed === 0){
      this.seed = Math.random();
    }
    noise.seed(this.seed);
    this.canvas = $('#world-div')[0];
    this.context = this.canvas.getContext('2d');
    $('#blitCanvas').remove();
    this.blitCanvas = $('<canvas width="1024" height="1024" style="position: absolute; left: -5000px; top: -1000px;" id="blitCanvas"></canvas>');
    $(document.body).append(this.blitCanvas);
    this.blitCanvas = this.blitCanvas[0];
    this.blitContext = this.blitCanvas.getContext('2d');
    this.draw();
  },

  draw: function(){
    this.build();
    this.renderBg();
    this.render(this.canvas);
  },

  renderBg: function(){
    var bl = this.blitContext;
    bl.fontStyle = '16px monospace'
    bl.fillStyle = this.color_dark;
    bl.fillRect(0, 0, this.blitCanvas.width, this.blitCanvas.height);
    bl.fillStyle = this.color_light;
    for (var _pos in this.world_structures){
      var pos = _pos.split('_');
      var struct = this.world_structures[_pos];
      if (struct.color)
        bl.fillStyle = struct.color;
      else
        bl.fillStyle = this.color_light;
      if (struct.symbol)
        struct = struct.symbol;
      bl.fillText(struct, pos[0] * 16, pos[1] * 16);
    }

  },

  render: function(){
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.context.fillStyle = this.color_dark;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.blitCanvas, 0 - (this.t * this.relX * 16), 0 - (this.t * this.relY * 16));
    this.context.fillStyle = this.color_green;
    this.context.fillText('웃', this.posX * 16, this.posY * 16);
  },

  mine: function(rX,rY){
    if(inventory.getObject('iron_pickaxe').quantity < 10){
      main.addMouseAlert('You need 10 iron pickaxes to mine');
      return;
    }
    var block = this.blockAt(rX,rY);
    if(!block || block.symbol !== 'X') return;
    inventory.addObject('iron_pickaxe',-10);
    this.isMining = true;
    this.move(rX,rY,true);
  },

  move: function(relX,relY,force){
    force = (typeof(force) === 'undefined') ? false : force;
    if (!force && this.isMoving) return;
    if (!force && !this.canMove(relX,relY)){
      if(this.blockAt(relX,relY).symbol === 'X'){
        this.mine(relX,relY);
      }
      return;
    }
    this.relX = relX;
    this.relY = relY;
    var startX = this.camX;
    var startY = this.camY;
    this.isMoving = true;
    this.start = new Date().getTime();
    this.timeEnd = this.start + 1000;
    this.interp = (function(t){
      this.camX = startX + t * this.relX;
      this.camY = startY + t * this.relY;
    }).bind(this);
    window.requestAnimationFrame(this.moveStep.bind(this));
  },

  moveStep: function(){
    var curTime = new Date().getTime();
    this.t = Math.min(1,((curTime - this.start) / (this.timeEnd - this.start)) * 4);
    this.interp(this.t);
    this.render();
    if(this.t < 1){
      window.requestAnimationFrame(this.moveStep.bind(this));
    }else{
      this.isMoving = false;
      this.interp = undefined;
      this.start = undefined;
      this.timeEnd = undefined;
      this.t = 0;
      if(this.isMining){
        this.place('mine',true);
        this.isMining = false;
      }
      world.draw();
      var struct = this.blockAt(0,0);
      if((!struct || struct.symbol == ' ') && Math.random() < 0.5){
        combat.startCombat(this.danger);
        return;
      }
      if(struct && struct.danger){
        adventure.startAdventure(struct.slug,struct.danger);
        return;
      }
      if(struct && this.grass_symbols.indexOf(struct.symbol) > -1 && Math.random() < 0.3){
        combat.startCombat(-1);
        return;
      }
      if(struct && struct.heals){
        combat.hp = combat.maxhp;
        this.spawnX = this.camX;
        this.spawnY = this.camY;
        main.addAlert('You were healed!');
      }
    }
  },

  place: function(item,force){
    force = (typeof(force) === 'undefined') ? false : force;
    var key = this.posX + '_' + this.posY;
    if(!force && key in this.world_structures){
      if($.inArray(this.world_structures[key].symbol,this.grass_symbols) < 0 &&
        this.world_structures[key].symbol !== ' '){
        return false;
      }
    }
    if(!force && key in this.placed_structures){
      return false;
    }
    this.placed_structures[(-1 * this.camX) + '_' + (-1 * this.camY)] = item;
    this.draw();
    return true;
  }
};

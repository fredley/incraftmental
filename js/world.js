var world = {
  seed: 0,
  world_structures: {},
  sprites: {},
  camX: 0,
  camY: 0,
  posX: 20,
  posY: 15,
  relX: 0,
  relY: 0,
  size: 40,
  t: 0,
  blocked: [0,0,0,0], // NESW
  color_dark: '#333',
  color_light:'#ddd',
  color_green:'#285',
  clutter_colors:['#285','#582','#592','#295','#4a6','#6a4'],
  clutter_symbols:['.', ',', '\'', '`'],

  danger: 0,

  home:       {display:'Home',       symbol: 'H', color: '#0f0'},
  wall:       {display:'Wall',       symbol: 'X', color: '#666'},
  water:      {display:'Water',      symbol: '~', color: '#55f'},

  structures: {
    cave:       {display:'Cave',       symbol: 'o', color: '#999'},
    pyramid:    {display:'Pyramid',    symbol: '^', color: '#f94'},
    settlement: {display:'Settlement', symbol: '#', color: '#3ff'},
  },

  calculateDanger: function(x, y){
    var x2 = (x+this.camX) - this.size/2;
    var y2 = (y+this.camY) - this.size/2;
    return Math.min(4,Math.floor(Math.sqrt(x2 * x2 + y2 * y2) / 10));
  },

  canMove: function(rX,rY){
    if(rY == -1) return !this.blocked[0];
    if(rX == 1)  return !this.blocked[1];
    if(rY == 1)  return !this.blocked[2];
    if(rX == -1) return !this.blocked[3];
  },

  blockAt: function(x,y){
    if(x == this.posX && y == this.posY - 1) this.blocked[0] = 1;
    if(x == this.posX + 1 && y == this.posY) this.blocked[1] = 1;
    if(x == this.posX && y == this.posY + 1) this.blocked[2] = 1;
    if(x == this.posX - 1 && y == this.posY) this.blocked[3] = 1;
  },

  build: function(){
    this.blocked = [0,0,0,0];
    for (var y = 0; y < this.size; y++){
      for (var x = 0; x < this.size; x++){
        var danger = this.calculateDanger(x,y);
        if(x == this.posX && y == this.posY){
          this.danger = danger;
        }
        if((x - this.posX + this.camX) == 0 && (y - this.posY + this.camY) == 0){
          this.world_structures[x + '_' + y] = this.home;
          continue;
        }
        var noise_value = Math.abs(noise.simplex2((x+this.camX)/20,(y+this.camY)/20));
        var struct_noise= Math.abs(noise.simplex2((x+this.camX),(y+this.camY)));
        if(struct_noise > 0.995){
          var struct = this.structures[Object.keys(this.structures)[Math.floor(noise_value * Object.keys(this.structures).length)]];
          this.world_structures[x + '_' + y] = struct;
          continue;
        }
        if(noise_value < 0.2 * Math.min(danger,1)){
          this.world_structures[x + '_' + y] = this.wall;
          this.blockAt(x,y);
          continue;
        }
        if (noise_value > 0.6 && noise_value < 0.9){
          var clutter = {
            color:  this.clutter_colors[Math.floor(Math.abs(noise.simplex2((y+this.camY)/5,(x+this.camX)/5)) * this.clutter_colors.length)],
            symbol: this.clutter_symbols[Math.floor(Math.abs(noise.simplex2((y+this.camY)/5,(x+this.camX)/5)) * this.clutter_symbols.length)]
          };
          this.world_structures[x + '_' + y] = clutter;
        }
        if(noise_value >= 0.9){
          this.world_structures[x + '_' + y] = this.water;
          this.blockAt(x,y);
        }
      }
    }
  },

  init: function(){
    if(this.seed === undefined || this.seed === 0){
      this.seed = Math.random();
    }
    this.world_structures={};
    noise.seed(this.seed);
    this.build();
    this.canvas = $('#world-div')[0];
    $('#blitCanvas').remove();
    this.context = this.canvas.getContext('2d');
    this.blitCanvas = $('<canvas width="1024" height="1024" style="position: absolute; left: -5000px; top: -1000px;" id="blitCanvas"></canvas>');
    $(document.body).append(this.blitCanvas);
    this.blitCanvas = this.blitCanvas[0];
    this.blitContext = this.blitCanvas.getContext('2d');
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

  move: function(relX, relY){
    if (this.isMoving) return;
    if (!this.canMove(relX,relY)) return;
    this.relX = relX;
    this.relY = relY;
    var startX = this.camX;
    var startY = this.camY;
    var _world = this;
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
      world.init();
    }
  }
};

var world = {
  seed: 0,
  world_structures: {},
  sprites: {},
  camX: 0,
  camY: 0,
  destX: 0,
  destY: 0,
  size: 32,
  color_dark: '#333',
  color_light:'#ddd',
  color_green:'#285',
  clutter_colors:['#862','#531'],
  clutter_symbols:['.', ',', '\'', '`'],

  structures: {
    pyramid:  {display:'Pyramid', symbol: '^', danger: 4, chance: 0.005},
    cave:     {display:'Cave',    symbol: 'o', danger: 1, chance: 0.01},
  },

  calculateDanger: function(x, y){
    return Math.floor(Math.sqrt(x * x + y * y) / 6);
  },

  build: function(){
    for (var y = 0; y < this.size; y++){
      for (var x = 0; x < this.size; x++){
        var noise_value = Math.abs(noise.simplex2(x/5,y/5));
        var danger = this.calculateDanger(x - this.size/2, y - this.size/2);
        for (var slug in this.structures){
          var structure = this.structures[slug];
          var dangerDiff = (structure.danger) ? Math.abs(danger - structure.danger) : 0;
          var chance = structure.chance * Math.pow(1.3, dangerDiff);
          if (noise_value < chance){
            this.world_structures[x + '_' + y] = structure;
            break;
          }
        }
        if (x + '_' + y in this.world_structures) continue;
        if (noise_value < 0.2){
          var clutter = {
            style:  this.clutter_colors[Math.floor(Math.abs(noise.simplex2(y/5,x/5)) * this.clutter_colors.length)],
            symbol: this.clutter_symbols[Math.floor(Math.abs(noise.simplex2(y/5,x/5)) * this.clutter_symbols.length)]
          };
          console.log(clutter);
          this.world_structures[x + '_' + y] = clutter;
        }
      }
    }
  },

  init: function(){
    if(this.seed===undefined || this.seed===0){
  		this.seed=Math.ceil(Math.random());
  	}
    noise.seed(this.seed);
    this.build();
    this.canvas = $('#world-div')[0];
    this.context = this.canvas.getContext('2d');
    this.blitCanvas = $('<canvas width="512" height="512" style="position: absolute; left: -5000px;"></canvas>');
    $(document.body).append(this.blitCanvas);
    this.blitCanvas = this.blitCanvas[0];
    this.blitContext = this.blitCanvas.getContext('2d');
    this.renderBg();
    this.render(0, 0);
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
      if (struct.style)
        bl.fillStyle = struct.style;
      else
        bl.fillStyle = this.color_light;
      if (struct.symbol)
        struct = struct.symbol;
      bl.fillText(struct, pos[0] * 16, pos[1] * 16);
    }

  },

  render: function(){
    this.context.fillStyle = this.color_dark;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.blitCanvas, this.camX * 16, this.camY * 16);
    this.context.fillStyle = this.color_green;
    this.context.fillText('@', 320, 240);
  },

  move: function(relX, relY){
    if (this.isMoving) return;
    var startX = this.camX;
    var startY = this.camY;
    var _world = this;
    this.isMoving = true;
    this.start = new Date().getTime();
    this.timeEnd = this.start + 1000;
    this.interp = (function(t){
      this.camX = startX + t * relX;
      this.camY = startY + t * relY;
    }).bind(this);
    window.requestAnimationFrame(this.moveStep.bind(this));
  },

  moveStep: function(){
    var curTime = new Date().getTime();
    var t = Math.min(1,((curTime - this.start) / (this.timeEnd - this.start)) * 4);
    this.interp(t);
    this.render();
    if (t < 1){
      window.requestAnimationFrame(this.moveStep.bind(this));
    } else {
      this.isMoving = false;
      this.interp = undefined;
      this.start = undefined;
      this.timeEnd = undefined;
    }
  }
};

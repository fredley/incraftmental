var inventory = {

  blocks : {
    air:            {display:'Air'},
    stone:          {display:'Stone'},
    grass:          {display:'Grass'},
    dirt:           {display:'Dirt'},
    cobble:         {display:'Cobblestone'},
    planks:         {display:'Planks'},
    sapling:        {display:'Sapling'},
    bedrock:        {display:'Bedrock'},
    sand:           {display:'Sand'},
    gravel:         {display:'Gravel'},
    gold_ore:       {display:'Gold Ore'},
    iron_ore:       {display:'Iron Ore'},
    coal_ore:       {display:'Coal Ore'},
    wood:           {display:'Wood'},
    glass:          {display:'Glass'},
    lapis_ore:      {display:'Lapis Lazuli Ore'},
    lapis:          {display:'Lapis Lazuli Block'},
    bed:            {display:'Bed'},
    wool:           {display:'Wool'},
    mushroom:       {display:'Mushroom'},
    gold:           {display:'Block of Gold'},
    iron:           {display:'Block of Iron'},
    tnt:            {display:'TNT'},
    obsidian:       {display:'Obsidian'},
    torch:          {display:'Torch'},
    chest:          {display:'Chest'},
    diamond_ore:    {display:'Diamond Ore'},
    diamond:        {display:'Block of Diamond'},
    crafting_table: {display:'Crafting Table'},
    wheat:          {display:'Wheat'},
    furnace:        {display:'Furnace'},
    redstone_ore:   {display:'Redstone Ore'},
    redstone:       {display:'Redstone'},
    cactus:         {display:'Cactus'},
    clay:           {display:'Clay'},
    sugar_cane:     {display:'Sugar Cane'},
    cake:           {display:'Cake'}
  },

  init : function(){
    for(var block in this.blocks){
      this.blocks[block].quantity = 0;
      this.blocks[block].hasOwned = false;
    }
  },

  addBlock : function(block){
    this.blocks[block].quantity++;
    this.blocks[block].hasOwned = true;
  },

  updateDisplay : function(){
    var inventoryText = "";
    for(var block in inventory.blocks){
      if(inventory.blocks[block].hasOwned){
        inventoryText += inventory.blocks[block].display + " - " + inventory.blocks[block].quantity + '<br>';
      }
    }
    $('#inventory').html(inventoryText);
  }

};

var inventory = {

  selected : null,

  objects: {

    blocks : {
      stone:          {display:'Stone'              , symbol: 's',                         },
      grass:          {display:'Grass'              , symbol: '-',                         },
      dirt:           {display:'Dirt'               , symbol: '%',                         },
      cobble:         {display:'Cobblestone'        , symbol: 'C',                         },
      planks:         {display:'Planks'             , symbol: 'P', recipe:'='              },
      sand:           {display:'Sand'               , symbol: 'S',                         },
      gravel:         {display:'Gravel'             , symbol: '$',                         },
      gold_ore:       {display:'Gold Ore'           , symbol: 'G',                         },
      iron_ore:       {display:'Iron Ore'           , symbol: 'I',                         },
      wood:           {display:'Wood'               , symbol: '=',                         },
      glass:          {display:'Glass'              , symbol: '~',                         },
      bed:            {display:'Bed'                , symbol: 'B', recipe:'WWPPP',         },
      wool:           {display:'Wool'               , symbol: 'W',                         },
      tnt:            {display:'TNT'                , symbol: 'X', recipe:'xSxSxSxSx'      },
      obsidian:       {display:'Obsidian'           , symbol: 'O',                         },
      torch:          {display:'Torch'              , symbol: 'L', recipe:'c  |'           },
      chest:          {display:'Chest'              , symbol: '&', recipe:'PPPP PPPP'      },
      crafting_table: {display:'Crafting Table'     , symbol: 'T', recipe:'PP PP'          },
      furnace:        {display:'Furnace'            , symbol: 'F', recipe:'CCCC CCCC'      },
      cactus:         {display:'Cactus'             , symbol: '!',                         },
      clay:           {display:'Clay'               , symbol: '.',                         },
      cake:           {display:'Cake'               , symbol: '*', recipe: 'MMM,o,;;;'     }
    },

    items: {
      apple :           {display:'Apple',           symbol: 'a',                           },
      arrow :           {display:'Arrow',           symbol: '^', recipe: 'Y   |   f'       },
      coal :            {display:'Coal',            symbol: 'c',                           },
      diamond :         {display:'Diamond',         symbol: 'd',                           },
      iron_ingot :      {display:'Iron Ingot',      symbol: 'i',                           },
      gold_ingot :      {display:'Gold Ingot',      symbol: 'g',                           },
      stick :           {display:'Stick',           symbol: '|', recipe: 'P  P'            },
      bowl :            {display:'Bowl',            symbol: 'U', recipe: 'P P P'           },
      mushrooom :       {display:'Mushroom',        symbol: 'm',                           },
      stew :            {display:'Mushroom Stew',   symbol: 'V', recipe: 'm  m  b'         },
      string :          {display:'String',          symbol: '@',                           },
      feather :         {display:'Feather',         symbol: 'f',                           },
      gunpowder :       {display:'Gunpowder',       symbol: 'x',                           },
      seeds :           {display:'Seeds',           symbol: ':',                           },
      wheat :           {display:'Wheat',           symbol: ';', recipe: ':::'             },
      bread :           {display:'Bread',           symbol: 'b',                           },
      flint :           {display:'Flint',           symbol: 'Y',                           },
      porkchop :        {display:'Raw Porkchop',    symbol: 'q',                           },
      cooked_porkchop : {display:'Cooked Porkchop', symbol: 'Q',                           },
      redstone :        {display:'Redstone',        symbol: 'r',                           },
      boat :            {display:'Boat',            symbol: '+', recipe: 'P PPPP'          },
      leather :         {display:'Leather',         symbol: 'l',                           },
      milk :            {display:'Milk',            symbol: 'M',                           },
      brick :           {display:'Brick',           symbol: '[',                           },
      cane :            {display:'Sugar Cane',      symbol: '/',                           },
      paper :           {display:'Paper',           symbol: '_', recipe: '///'             },
      book :            {display:'Book',            symbol: 'p', recipe: '___l'            },
      egg :             {display:'Egg',             symbol: 'o',                           },
      compass :         {display:'Compass',         symbol: '>',                           },
      fish :            {display:'Raw Fish',        symbol: 'z',                           },
      cooked_fish :     {display:'Cooked Fish',     symbol: 'Z',                           },
      sugar :           {display:'Sugar',           symbol: ',', recipe: '/'               },
      sapling:          {display:'Sapling',         symbol: 's',                           }
    },

    tools : {
      wooden_sword : {display:'Wooden Sword',       recipe: 'P  P  |' },
      wooden_shovel : {display:'Wooden Shovel',     recipe: 'P  |  |' },
      wooden_pickaxe : {display:'Wooden Pickaxe',   recipe: 'PPP |  |'},
      wooden_axe : {display:'Wooden Axe',           recipe: 'PP P|  |'},
      stone_sword : {display:'Stone Sword',         recipe: 'C  C  |' },
      stone_shovel : {display:'Stone Shovel',       recipe: 'C  |  |' },
      stone_pickaxe : {display:'Stone Pickaxe',     recipe: 'CCC |  |'},
      stone_axe : {display:'Stone Axe',             recipe: 'CC C|  |'},
      iron_sword : {display:'Iron Sword',           recipe: 'i  i  |' },
      iron_shovel : {display:'Iron Shovel',         recipe: 'i  |  |' },
      iron_picaxe : {display:'Iron Pickaxe',        recipe: 'iii |  |'},
      iron_axe : {display:'Iron Axe',               recipe: 'ii i|  |'},
      gold_sword : {display:'Golden Sword',         recipe: 'g  g  |' },
      gold_shovel : {display:'Golden Shovel',       recipe: 'g  |  |' },
      gold_pickaxe : {display:'Golden Pickaxe',     recipe: 'ggg |  |'},
      gold_axe : {display:'Golden Axe',             recipe: 'gg g|  |'},
      diamond_sword : {display:'Diamond Sword',     recipe: 'd  d  |' },
      diamond_shovel : {display:'Diamond Shovel',   recipe: 'd  |  |' },
      diamond_pickaxe : {display:'Diamond Pickaxe', recipe: 'ddd |  |'},
      diamond_axe : {display:'Diamond Axe',         recipe: 'dd d|  |'},
      wooden_hoe : {display:'Wooden Hoe',           recipe: 'PP  |  |'},
      stone_hoe : {display:'Stone Hoe',             recipe: 'CC  |  |'},
      iron_hoe : {display:'Iron Hoe',               recipe: 'ii  |  |'},
      gold_hoe : {display:'Gold Hoe',               recipe: 'gg  |  |'},
      diamond_hoe : {display:'Diamond Hoe',         recipe: 'dd  |  |'},
      fishing_rod : {display:'Fishing Rod',         recipe: '| |@| @' },
      bow : {display:'Bow',                         recipe: '|@| @ |@'}
    },

    armour : {
      leather_helmet : {display:'Leather Cap',        recipe:'llll l'   },
      leather_chest : {display:'Leather Tunic',       recipe:'l lllllll'},
      leather_pants : {display:'Leather Pants',       recipe:'llll ll l'},
      leather_boots : {display:'Leather Boots',       recipe:'l ll l'   },
      iron_helmet : {display:'Iron Helmet',           recipe:'iiii i'   },
      iron_chest : {display:'Iron Chestplate',        recipe:'i iiiiiii'},
      iron_leggings : {display:'Iron Leggings',       recipe:'iiii ii i'},
      iron_boots : {display:'Iron Boots',             recipe:'i ii i'   },
      diamond_helmet : {display:'Diamond Helmet',     recipe:'dddd d'   },
      diamond_chest : {display:'Diamond Chestplate',  recipe:'d ddddddd'},
      diamond_leggings : {display:'Diamond Leggings', recipe:'dddd dd d'},
      diamond_boots : {display:'Diamond Boots',       recipe:'d dd d'   },
      gold_helmet : {display:'Golden Helmet',         recipe:'gggg g'   },
      gold_chest : {display:'Golden Chestplate',      recipe:'g ggggggg'},
      gold_leggings : {display:'Golden Leggings',     recipe:'gggg gg g'},
      gold_boots : {display:'Golden Boots',           recipe:'g gg g'   }
    }
  },

  init : function(){
    for(var group in this.objects){
      for(var object in this.objects[group]){
        this.objects[group][object].quantity = 0;
        this.objects[group][object].hasOwned = false;
      }
    }
  },

  addObject : function(slug){
    for(var group in this.objects){
      if(slug in this.objects[group]){
        this.objects[group][slug].quantity++;
        this.objects[group][slug].hasOwned = true;
      }
    }
  },

  getObject : function(slug){
    for(var group in this.objects){
      if(slug in this.objects[group]){
        return this.objects[group][slug];
      }
    }
  },

  updateDisplay : function(){
    var inventoryText = "";
    for(var group in this.objects){
      inventoryText += "<h3>" + group + "</h3>";
      for(var object in this.objects[group]){
        if(this.objects[group][object].hasOwned){
          inventoryText += '<div class="inventory-item';
          inventoryText += (this.selected == object) ? " selected" : "";
          inventoryText += '" data-object="' + object + '">' + this.objects[group][object].display + " - " + this.objects[group][object].quantity + '</div>';
        }
      }
    }
    $('#inventory').html(inventoryText);
    buttons.hook_inventory();
  },

};

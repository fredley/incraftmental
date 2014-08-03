var inventory = {

  selected : null,
  smelting : false,

  objects: {

    blocks : {
      stone:          {display:'Stone'              , symbol: 's'                                                   },
      grass:          {display:'Grass'              , symbol: '-'                                                   },
      dirt:           {display:'Dirt'               , symbol: '%'                                                   },
      cobble:         {display:'Cobblestone'        , symbol: 'C'                        , smelts_to: 'stone'       },
      planks:         {display:'Planks'             , symbol: 'P', recipe:'=' , yield:4  , fuel_source: 2           },
      sand:           {display:'Sand'               , symbol: 'S'                        , smelts_to: 'glass'       },
      gravel:         {display:'Gravel'             , symbol: '$'                                                   },
      gold_ore:       {display:'Gold Ore'           , symbol: 'G'                        , smelts_to: 'gold_ingot'  },
      iron_ore:       {display:'Iron Ore'           , symbol: 'I'                        , smelts_to: 'iron_ingot'  },
      wood:           {display:'Wood'               , symbol: '='                        , fuel_source: 2           },
      glass:          {display:'Glass'              , symbol: '~'                                                   },
      bed:            {display:'Bed'                , symbol: 'B', recipe:'WWPPP',                                  },
      wool:           {display:'Wool'               , symbol: 'W'                                                   },
      tnt:            {display:'TNT'                , symbol: 'X', recipe:'xSxSxSxSx'                               },
      obsidian:       {display:'Obsidian'           , symbol: 'O'                                                   },
      torch:          {display:'Torch'              , symbol: 'L', recipe:'c  |', yield:4                           },
      chest:          {display:'Chest'              , symbol: '&', recipe:'PPPP PPPP'    , fuel_source: 2           },
      crafting_table: {display:'Crafting Table'     , symbol: 'T', recipe:'PP PP'        , fuel_source: 2           },
      furnace:        {display:'Furnace'            , symbol: 'F', recipe:'CCCC CCCC'    , fuel_level:{cur:0,max:0} },
      cactus:         {display:'Cactus'             , symbol: '!'                                                   },
      clay:           {display:'Clay'               , symbol: '.'                        , smelts_to: 'brick'       },
      cake:           {display:'Cake'               , symbol: '*', recipe: 'MMM,o,;;;'   , food: 20                 }
    },

    items: {
      apple :           {display:'Apple',           symbol: 'a', food: 3                                            },
      arrow :           {display:'Arrow',           symbol: '^', recipe: 'Y   |   f'                                },
      coal :            {display:'Coal',            symbol: 'c'                           , fuel_source: 8          },
      diamond :         {display:'Diamond',         symbol: 'd'                                                     },
      iron_ingot :      {display:'Iron Ingot',      symbol: 'i'                                                     },
      gold_ingot :      {display:'Gold Ingot',      symbol: 'g'                                                     },
      stick :           {display:'Stick',           symbol: '|', recipe: 'P  P', yield:4  , fuel_source: 1          },
      bowl :            {display:'Bowl',            symbol: 'U', recipe: 'P P P'                                    },
      mushrooom :       {display:'Mushroom',        symbol: 'm', food: 1                                            },
      stew :            {display:'Mushroom Stew',   symbol: 'V', recipe: 'm  m  b'         , food: 12               },
      string :          {display:'String',          symbol: '@', mob_drop:1                                         },
      feather :         {display:'Feather',         symbol: 'f', mob_drop:1                                         },
      gunpowder :       {display:'Gunpowder',       symbol: 'x', mob_drop:1                                         },
      seeds :           {display:'Seeds',           symbol: ':'                                                     },
      wheat :           {display:'Wheat',           symbol: ';', recipe: ':::', yield:3   , food: 2                 },
      bread :           {display:'Bread',           symbol: 'b', recipe: ';;;'            , food: 5                 },
      flint :           {display:'Flint',           symbol: 'Y'                                                     },
      porkchop :        {display:'Raw Porkchop',    symbol: 'q', food: 4, mob_drop:1, smelts_to: 'cooked_porkchop'  },
      cooked_porkchop : {display:'Cooked Porkchop', symbol: 'Q', cooked_from: 'porkchop'  , food: 16                },
      redstone :        {display:'Redstone',        symbol: 'r'                                                     },
      boat :            {display:'Boat',            symbol: '+', recipe: 'P PPPP'                                   },
      leather :         {display:'Leather',         symbol: 'l', mob_drop:1                                         },
      milk :            {display:'Milk',            symbol: 'M', mob_drop:1                                         },
      brick :           {display:'Brick',           symbol: '['                                                     },
      cane :            {display:'Sugar Cane',      symbol: '/'                                                     },
      paper :           {display:'Paper',           symbol: '_', recipe: '///', yield:3                             },
      book :            {display:'Book',            symbol: 'p', recipe: '___l'                                     },
      egg :             {display:'Egg',             symbol: 'o', food: 1, mob_drop:1                                },
      compass :         {display:'Compass',         symbol: '>'                                                     },
      fish :            {display:'Raw Fish',        symbol: 'z', food: 3, smelts_to: 'cooked_fish'                  },
      cooked_fish :     {display:'Cooked Fish',     symbol: 'Z', food: 12, cooked_from: 'fish'                      },
      sugar :           {display:'Sugar',           symbol: ',', recipe: '/'                                        },
      sapling:          {display:'Sapling',         symbol: 's', fuel_source: 1                                     }
    },

    tools : {
      wooden_sword :    {display:'Wooden Sword',    profession: 'adventurer', recipe: 'P  P  |' , bonus:1, gives: {porkchop:0.05}                                                                   },
      stone_sword :     {display:'Stone Sword',     profession: 'adventurer', recipe: 'C  C  |' , bonus:2, gives: {porkchop:0.1, egg:0.1, string:0.05}                                              },
      iron_sword :      {display:'Iron Sword',      profession: 'adventurer', recipe: 'i  i  |' , bonus:3, gives: {porkchop:0.1, egg:0.1, string:0.1, feather:0.1, leather:0.1}                     },
      gold_sword :      {display:'Golden Sword',    profession: 'adventurer', recipe: 'g  g  |' , bonus:4, gives: {porkchop:0.1, egg:0.1, string:0.2, feather:0.1, leather:0.1, wool:0.1}           },
      diamond_sword :   {display:'Diamond Sword',   profession: 'adventurer', recipe: 'd  d  |' , bonus:5, gives: {porkchop:0.1, egg:0.1, string:0.2, feather:0.1, leather:0.1, wool:0.1, milk:0.1} },
      wooden_shovel :   {display:'Wooden Shovel',   profession: 'labourer',   recipe: 'P  |  |' , bonus:1, gives: {dirt:0.5}                                                                        },
      stone_shovel :    {display:'Stone Shovel',    profession: 'labourer',   recipe: 'C  |  |' , bonus:2, gives: {dirt:0.8, flint:0.01, gravel:0.1, sand:0.2}                                      },
      iron_shovel :     {display:'Iron Shovel',     profession: 'labourer',   recipe: 'i  |  |' , bonus:3, gives: {dirt:0.8, flint:0.01, gravel:0.1, sand:0.2}                                      },
      gold_shovel :     {display:'Golden Shovel',   profession: 'labourer',   recipe: 'g  |  |' , bonus:4, gives: {dirt:0.8, flint:0.01, gravel:0.1, sand:0.2, clay:0.1}                            },
      diamond_shovel :  {display:'Diamond Shovel',  profession: 'labourer',   recipe: 'd  |  |' , bonus:5, gives: {dirt:0.8, flint:0.05, gravel:0.1, sand:0.2, clay:0.1}                            },
      wooden_pickaxe :  {display:'Wooden Pickaxe',  profession: 'smith',      recipe: 'PPP |  |', bonus:1, gives: {cobble:0.5, coal:0.05}                                                           },
      stone_pickaxe :   {display:'Stone Pickaxe',   profession: 'smith',      recipe: 'CCC |  |', bonus:2, gives: {cobble:0.8, coal:0.1, iron_ore:0.05}                                             },
      iron_picaxe :     {display:'Iron Pickaxe',    profession: 'smith',      recipe: 'iii |  |', bonus:3, gives: {cobble:0.8, coal:0.1, iron_ore:0.1, gold_ore:0.01}                               },
      gold_pickaxe :    {display:'Golden Pickaxe',  profession: 'smith',      recipe: 'ggg |  |', bonus:4, gives: {cobble:0.8, coal:0.1, iron_ore:0.1, gold_ore:0.02, diamond: 0.01}                },
      diamond_pickaxe : {display:'Diamond Pickaxe', profession: 'smith',      recipe: 'ddd |  |', bonus:5, gives: {cobble:0.8, coal:0.1, iron_ore:0.2, gold_ore:0.05, diamond: 0.02, redstone: 0.05}},
      wooden_axe :      {display:'Wooden Axe',      profession: 'builder',    recipe: 'PP P|  |', bonus:1, gives: {wood:0.5, apple:0.001}                                                           },
      stone_axe :       {display:'Stone Axe',       profession: 'builder',    recipe: 'CC C|  |', bonus:2, gives: {wood:0.7, sapling:0.1, apple:0.01}                                               },
      iron_axe :        {display:'Iron Axe',        profession: 'builder',    recipe: 'ii i|  |', bonus:3, gives: {wood:0.8, sapling:0.1, apple:0.05}                                               },
      gold_axe :        {display:'Golden Axe',      profession: 'builder',    recipe: 'gg g|  |', bonus:4, gives: {wood:0.8, sapling:0.1, apple:0.2}                                                },
      diamond_axe :     {display:'Diamond Axe',     profession: 'builder',    recipe: 'dd d|  |', bonus:5, gives: {wood:0.8, sapling:0.1, apple:0.05}                                               },
      wooden_hoe :      {display:'Wooden Hoe',      profession: 'chef',       recipe: 'PP  |  |', bonus:1, gives: {seeds: 0.1}                                                                      },
      stone_hoe :       {display:'Stone Hoe',       profession: 'chef',       recipe: 'CC  |  |', bonus:2, gives: {seeds: 0.2, cactus:0.05}                                                         },
      iron_hoe :        {display:'Iron Hoe',        profession: 'chef',       recipe: 'ii  |  |', bonus:3, gives: {seeds: 0.2, cactus:0.1, mushroom:0.1}                                            },
      gold_hoe :        {display:'Gold Hoe',        profession: 'chef',       recipe: 'gg  |  |', bonus:4, gives: {seeds: 0.2, cactus:0.1, mushroom:0.1, cane:0.1}                                  },
      diamond_hoe :     {display:'Diamond Hoe',     profession: 'chef',       recipe: 'dd  |  |', bonus:5, gives: {seeds: 0.2, cactus:0.1, mushroom:0.1, cane:0.1}                                  },
      fishing_rod :     {display:'Fishing Rod',     profession: 'fisher',     recipe: '| |@| @' , bonus:1, gives: {fish:0.1}                                                                        },
      bow :             {display:'Bow',             profession: 'hunter',     recipe: '|@| @ |@', bonus:1, gives: {gunpowder:0.1}                                                                   }
    },

    armour : {
      leather_helmet :   {display:'Leather Cap',        recipe:'llll l'   },
      leather_chest :    {display:'Leather Tunic',      recipe:'l lllllll'},
      leather_pants :    {display:'Leather Pants',      recipe:'llll ll l'},
      leather_boots :    {display:'Leather Boots',      recipe:'l ll l'   },
      iron_helmet :      {display:'Iron Helmet',        recipe:'iiii i'   },
      iron_chest :       {display:'Iron Chestplate',    recipe:'i iiiiiii'},
      iron_leggings :    {display:'Iron Leggings',      recipe:'iiii ii i'},
      iron_boots :       {display:'Iron Boots',         recipe:'i ii i'   },
      diamond_helmet :   {display:'Diamond Helmet',     recipe:'dddd d'   },
      diamond_chest :    {display:'Diamond Chestplate', recipe:'d ddddddd'},
      diamond_leggings : {display:'Diamond Leggings',   recipe:'dddd dd d'},
      diamond_boots :    {display:'Diamond Boots',      recipe:'d dd d'   },
      gold_helmet :      {display:'Golden Helmet',      recipe:'gggg g'   },
      gold_chest :       {display:'Golden Chestplate',  recipe:'g ggggggg'},
      gold_leggings :    {display:'Golden Leggings',    recipe:'gggg gg g'},
      gold_boots :       {display:'Golden Boots',       recipe:'g gg g'   }
    }
  },

  init : function(){
    for(var group in this.objects){
      for(var object in this.objects[group]){
        item = this.objects[group][object]
        item.quantity = 0;
        item.hasOwned = false;
        item.slug = object;
      }
    }
  },

  addObject : function(slug,quantity){
    if(typeof(quantity)==='undefined') quantity = 1;

    for(var group in this.objects){
      if(slug in this.objects[group]){
        this.objects[group][slug].quantity += quantity;
        this.objects[group][slug].hasOwned = true;

        return true;
      }
    }

    return false;
  },

  getObject : function(slug){
    for(var group in this.objects){
      if(slug in this.objects[group]){
        return this.objects[group][slug];
      }
    }
  },

  getObjectFromRecipe : function(code) {
    for(var group in inventory.objects){
      for(var object in inventory.objects[group]){
        if(inventory.objects[group][object].recipe == code){
          return inventory.objects[group][object];
        }
      }
    }
  },

  getIngredients : function(slug){
    var object = this.getObject(slug);
    var needed = {};
    for(var i=0; i < object.recipe.length; i++){
      if(object.recipe[i] == ' ') continue;
      for(var group in this.objects){
        for(var ingredient in this.objects[group]){
          if(this.objects[group][ingredient].symbol == object.recipe[i]){
            if(ingredient in needed){
              needed[ingredient]++;
            }else{
              needed[ingredient] = 1;
            }
          }
        }
      }
    }
    return needed;
  },

  canCraft : function(slug){
    var object = this.getObject(slug);
    if(!object.recipe) return false;
    var needed = this.getIngredients(slug);
    for(var ingredient in needed){
      if (this.getObject(ingredient).quantity < 10 * needed[ingredient]){
        return false;
      }
    }
    return true;
  },

  craft : function(slug){
    var object = this.getObject(slug);
    if(!object.recipe) return false;
    var needed = this.getIngredients(slug);
    for(var ingredient in needed){
      this.addObject(ingredient,-10 * needed[ingredient]);
    }
    this.addObject(slug,object.yield);
    if(this.getObject(slug).on_craft !== undefined){
      this.getObject(slug).on_craft();
    }
    this.updateDisplay();
    buttons.updateDisplay();
  },

  in : function(category,object){
    return (object in this.objects[category]);
  },

  doTools : function(){
    for(var tool in this.objects.tools){
      if(this.objects.tools[tool].quantity < 1) continue;
      for(var slug in this.objects.tools[tool].gives){
        if(Math.random() < this.objects.tools[tool].gives[slug]){
          this.addObject(slug,this.objects.tools[tool].bonus * this.objects.tools[tool].quantity);
        }
      }
    }
  },

  updateDisplay : function(){
    var inventoryText = "";
    for(var group in this.objects){
      var showGroup = false;
      var groupText = "<h3>" + group.capitalize() + "</h3>";
      for(var object in this.objects[group]){
        if(this.objects[group][object].hasOwned){
          showGroup = true;
          groupText += '<div class="item inventory-item';
          groupText += (this.selected == object) ? " selected" : "";
          groupText += '" data-object="' + object + '">' + this.objects[group][object].display + " - " + this.objects[group][object].quantity + '</div>';
        }
      }
      if(showGroup){
        inventoryText += groupText;
      }
    }
    $('#inventory').html(inventoryText);
    buttons.hook_inventory();
  }

};

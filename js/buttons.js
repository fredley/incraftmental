var buttons = {

getRecipeFromCraftingGrid : function() {
  var code = '';
  var needed = {};
  $('.craft-square').each(function(){
    if($(this).attr('data-object')){
      code += inventory.getObject($(this).attr('data-object')).symbol;
      if($(this).attr('data-object') in needed){
        needed[$(this).attr('data-object')]++;
      }else{
        needed[$(this).attr('data-object')] = 1;
      }
    }else{
      code += ' ';
    }
  });
  code = code.trim();
  return [code, needed];
},

handleCraft : function(needed, item) {
  inventory.addObject(item.slug,item.yield);
  var replace = true;
  for(material in needed){
    if(inventory.getObject(material).quantity < 10 * needed[material]){
      replace = false;
    }
  }
  if(replace){
    for(material in needed){
      inventory.addObject(material,-10 * needed[material]);
    }
  }else{
    $('.craft-square').removeAttr('data-object');
    $('.craft-square').html('');
  }

  inventory.updateDisplay();

  return replace;
},

craftCount : function(n) {
  var codeNeeded = this.getRecipeFromCraftingGrid();
  var item = inventory.getObjectFromRecipe(codeNeeded[0]);
  if(item){
    for (var count = 0; count < n; count++){
      if(this.handleCraft(codeNeeded[1], item)){
      }
    }
    if (item.yield){
      count *= item.yield;
    }
    var name = item.display;
    name = name.formatAnMultiple(count);
    main.addAlert('Crafted ' + name);
  } else {
    main.addAlert('Unable to find item to craft');
  }
},

init : function(){
  $('#get-wood').on('click',function(){
    inventory.addObject('wood');
    $('#inventory').show();
    inventory.updateDisplay();
    if(inventory.objects.blocks.wood.quantity >= 10){
      $('#make-planks').show();
    }
  });
  $('#make-planks').on('click',function(){
    var amount = inventory.objects.blocks.crafting_table.hasOwned ? 4 : 1;
    if(inventory.objects.blocks.wood.quantity >= 10){
      inventory.objects.blocks.wood.quantity -= 10;
      inventory.addObject('planks',amount);
      inventory.updateDisplay();
      if(inventory.objects.blocks.planks.quantity >= 4){
        $('#make-crafting').show();
      }
    }
  });
  $('#make-crafting').on('click',function(){
    if(inventory.objects.blocks.planks.quantity >= 4){
      inventory.objects.blocks.planks.quantity -= 4;
      inventory.addObject('crafting_table');
      inventory.updateDisplay();
      this.updateDisplay();
      main.addAlert('Made a Crafting Table!');
    }
  });
  $('#get-villager').on('click',function(e){
    if(inventory.objects.items.apple.quantity > villagers.cost){
      inventory.objects.items.apple.quantity -= villagers.cost;
      villagers.addVillager();
      villagers.cost *= 2;
      buttons.updateDisplay();
      inventory.updateDisplay();
      villagers.updateDisplay();
    }else{
      main.addMouseAlert('Not enough Apples! :(',e);
    }
  });
  $('.craft-square').on('click',function(e){
    if($(this).attr('data-object')){
      $(this).html("");
      inventory.getObject($(this).attr('data-object')).quantity += 10;
      $(this).removeAttr('data-object');
      inventory.updateDisplay();
      return;
    }
    var object = inventory.selected;
    if(!object){
      main.addMouseAlert('Select an item to craft!',e);
      return;
    }
    if(inventory.getObject(object).quantity >= 10){
      inventory.getObject(object).quantity -= 10;
      $(this).html(inventory.getObject(object).symbol);
      $(this).attr('data-object',object);
      inventory.updateDisplay();
    }else{
      main.addMouseAlert('Not enough to craft (10 required)!',e);
    }
  });
  $('.smelt-square.input').on('click',function(e){
    if($(this).attr('data-object')){
      $(this).html("");
      inventory.getObject($(this).attr('data-object')).quantity += 10;
      $(this).removeAttr('data-object');
      inventory.updateDisplay();
      return;
    }
    var object = inventory.selected;
    if(!object){
      main.addMouseAlert('Select an item!',e);
      return;
    }
    if(inventory.getObject(object).quantity >= 10){
      inventory.getObject(object).quantity -= 10;
      $(this).html(inventory.getObject(object).symbol);
      $(this).attr('data-object',object);
      inventory.updateDisplay();
    }else{
      main.addMouseAlert('Not enough to smelt (10 required)!',e);
    }
  });
  $(".work-tab").on('click',function(){
    $('.page').hide();
  	$("#" + $(this).attr('data-for')).show();
    $('.work-tab').removeClass('active');
    $(this).addClass('active');
  });
  $('#smelt').on('click',function(){
  	var fuel, input, output, timer;
  	fuel   = $("#smelt-fuel").attr('data-object');
  	input  = $("#smelt-input").attr('data-object');
  	output = inventory.getObject(input).smelts_to;

  	if(inventory.objects.blocks.furnace.fuel_level.cur <= 0){
  	  if(inventory.getObject(fuel).fuel_source == undefined) return false;
  	  inventory.objects.blocks.furnace.fuel_level.max = inventory.getObject(fuel).fuel_source;
  	  inventory.objects.blocks.furnace.fuel_level.cur = inventory.objects.blocks.furnace.fuel_level.max;
  	}
  	inventory.objects.blocks.furnace.fuel_level.cur--;
  	if(output == undefined) return false;
    $('#smelt-progress .bar').animate({'left': 0},10000,function(){
      $(this).css('left','-90px');
      inventory.addObject(output,1);
      main.addAlert('Smelting Completed');
    });
    this.hook_inventory();
    this.hook_villagers();
    this.updateDisplay();
  });
  $('#craft').on('click',function() {
    buttons.craftCount(1);
  });
  $('#craft_10').on('click',function() {
    buttons.craftCount(10);
  });
  $('#craft_100').on('click',function() {
    buttons.craftCount(100);
  });
},

hook_inventory : function(){
  $('.inventory-item').on('click',function(){
    $('.inventory-item').removeClass('selected');
    $(this).addClass('selected');
    inventory.selected = $(this).attr('data-object');
  });
},

hook_villagers : function(){
  $('.villager').on('click',function(e){
    if(!inventory.selected) return;
    var v = villagers.population[$(this).attr('data-id')];
    if(inventory.selected && !v.enabled && inventory.in('tools',inventory.selected)){
      if(inventory.getObject(inventory.selected).quantity >= 10){
        inventory.addObject(inventory.selected,-10);
        villagers.assignProfession($(this).attr('data-id'),inventory.getObject(inventory.selected).profession,inventory.getObject(inventory.selected).bonus);
      }else{
        main.addMouseAlert('You must have 10 of a tool to assign.',e);
      }
    }else{
      if(v.profession){
        var o = inventory.getObject(inventory.selected);
        if(v.profession == 'smith'   && o.smelts_to ||
           v.profession == 'builder' && o.recipe    ){
          villagers.assignObject($(this).attr('data-id'),inventory.selected);
        }else{
          main.addMouseAlert('This villager can\'t work with that :(',e);
        }
      }else{
        main.addMouseAlert('Select a tool to assign a villager.',e);
      }
    }
  });
  $('.pause').on('click',function(e){
    e.stopPropagation();
    var v = villagers.population[$(this).attr('data-id')];
    if(!v.profession){
      main.addMouseAlert('You must give a villager a tool to enable it',e);
      return;
    }
    v.enabled = !v.enabled;
    villagers.updateDisplay();
  });
},

updateDisplay : function(){
  if(inventory.objects.blocks.wood.hasOwned){
    $('#make-planks').show();
    $('#inventory').show();
  }
  if(inventory.objects.blocks.planks.hasOwned){
    $('#make-crafting').show();
  }
  if(inventory.objects.blocks.crafting_table.hasOwned){
    $('#work-area').show();
    if($('.work-tab.active').length === 0){
      $('#crafting').show();
    }
    $('#work-area').show();
  }
  if(inventory.objects.blocks.furnace.hasOwned){
    $('#tab-crafting').show();
    $('#tab-smelting').show();
    if($('.work-tab.active').length !== 1){
      $('#tab-crafting').addClass('active');
    }
  }
  if(inventory.objects.items.apple.hasOwned){
    $('#get-villager').show();
    $('#get-villager').html('Get a villager (' + villagers.cost + ' apple' + ((villagers.cost > 1) ? 's' : '') + ')');
  }
}

};

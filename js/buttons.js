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
  return {code:code,needed:needed};
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

craftCount : function(n,e) {
  var recipe = this.getRecipeFromCraftingGrid();
  var item = inventory.getObjectFromRecipe(recipe.code);
  if(item){
    for (var count = 0; count < n; count++){
      if(!this.handleCraft(recipe.needed, item)){
        break;
      }
    }
    if (item.yield){
      count *= item.yield;
    }
    var name = item.display;
    name = name.formatAnMultiple(count);
    main.addAlert('Crafted ' + name);
  } else {
    main.addMouseAlert('That\'s not a valid recipe :(',e);
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
      buttons.updateDisplay();
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
    if($(this).attr('id') === 'smelt-product'){
      if($(this).attr('data-object')){
        inventory.addObject($(this).attr('data-object'),1);
        $(this).attr('data-object','');
        $(this).html('');
      }else{
        main.addMouseAlert('You can\'t put an item there!',e);
      }
      return;
    }
    if($(this).attr('data-object')){
      $(this).html("");
      inventory.addObject($(this).attr('data-object'),10);
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
    if($(this).attr('data-for') == 'exploration'){
      $('#inventory').hide();
      $('#villagers').hide();
      main.sidebars_visible = false;
      $('#work-area').css('width',800);
    }else{
      $('#inventory').show();
      $('#villagers').show();
      main.sidebars_visible = true;
      $('#work-area').css('width',450);
    }
  });
  $('#smelt').on('click',function(e){
    if(inventory.smelting){
      main.addMouseAlert("Smelting already in progress!",e);
      return;
    }
  	var fuel, input, output, timer;
    var fuel_level = inventory.objects.blocks.furnace.fuel_level;
  	fuel   = $("#smelt-fuel").attr('data-object');
  	input  = $("#smelt-input").attr('data-object');
    if(!input){
      main.addMouseAlert("You must put items into the furnace!",e);
      return;
    }
    if(!fuel && fuel_level.cur <= 0){
      main.addMouseAlert("You must fuel the furnace!",e);
      return;
    }
  	output = inventory.getObject(input).smelts_to;
    if(fuel_level.cur <= 0 && inventory.getObject(fuel).fuel_source == undefined){
      main.addMouseAlert("That's not a valid fuel :(",e);
      return;
    }
    if(output == undefined){
      main.addMouseAlert("That can't be smelted :(",e);
      return;
    }
    if($("#smelt-product").attr('data-object')){
      main.addMouseAlert("Furnace is full!",e);
      return;
    }
  	if(fuel_level.cur <= 0){
  	  fuel_level.max = inventory.getObject(fuel).fuel_source;
  	  fuel_level.cur = fuel_level.max;
      $('#fuel-line .bar').css('top',0);
      $("#smelt-fuel").removeAttr('data-object');
      $("#smelt-fuel").html('');
  	}
  	fuel_level.cur--;
    $("#smelt-input").removeAttr('data-object');
    $("#smelt-input").html('');
    inventory.smelting = true;
    $('#fuel-line .bar').animate({'top':90 - (90 / fuel_level.max) * fuel_level.cur},10000,'linear');
    $('#smelt-progress .bar').animate({'left': 0},10000,'linear',function(){
      $(this).css('left','-90px');
      inventory.smelting = false;
      $("#smelt-product").attr('data-object',inventory.getObject(input).smelts_to);
      $("#smelt-product").html(inventory.getObject(output).symbol);
      main.addAlert('Smelting Completed');
    });
    inventory.updateDisplay();
  });
  $('#craft').on('click',function(e) {
    buttons.craftCount(1,e);
  });
  $('#craft_10').on('click',function(e) {
    buttons.craftCount(10,e);
  });
  $('#craft_100').on('click',function(e) {
    buttons.craftCount(100,e);
  });
  $('.explore_move').on('click',function(){
    var x = $(this).attr('data-x');
    var y = $(this).attr('data-y');
    world.move(x,y);
  });
  $('#options').on('click', function(){
  	$('#options-menu').toggle();
  });
  $('#load').on('click', function(){
  	main.save();
  	$('#save-text').val(localStorage['save']);
  });
  $('#save').on('click', function(){
  	localStorage['save'] = $('#save-text').val();
  	main.load();
  });
  this.hook_inventory();
  this.hook_villagers();
  this.updateDisplay();
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
        if(v.profession == 'smith'      && o.smelts_to && !o.food ||
           v.profession == 'builder'    && o.recipe    && !o.food ||
           v.profession == 'labourer'   && o.gives && !(o.contains('sword') || o.contains('bow')) ||
           v.profession == 'chef'       && (o.cooked_from || o.food && o.recipe) ||
           v.profession == 'adventurer' && o.mob_drop ){
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
    if(main.sidebars_visible) $('#inventory').show();
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
    $('#tab-exploration').show();
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

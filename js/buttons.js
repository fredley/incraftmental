var buttons = {

craftCount : function(n,e){
  var code = '';
  var needed = {};
  $('.craft-square').each(function(){
    var data = $(this).attr('data-object');
    if(data){
      code += inventory.getObject(data).symbol;
      if(data in needed){
        needed[data]++;
      }else{
        needed[data] = 1;
      }
    }else{
      code += ' ';
    }
  });
  var item = inventory.getObjectFromRecipe(code.trim());
  if(!item){
    item = inventory.getObjectFromRecipe(inventory.mirrorRecipe(code).trim());
    if(!item){
      main.addMouseAlert('That\'s not a valid recipe :(',e);
      return;
    }
  }
  var count = n;
  for(material in needed){
    count = Math.floor(Math.min(count,inventory.getObject(material).quantity / (10 * needed[material])));
  }
  for(material in needed){
    inventory.addObject(material,needed[material] * count * -10);
  }
  if(count !== n){
    $('.craft-square').html('');
    $('.craft-square').removeAttr('data-object');
    count += 1;
  }
  inventory.addObject(item.slug,item.yield * count);
  var ss = (count * item.yield == 1) ? '' : 's';
  main.addAlert('Crafted ' + count * item.yield + ' ' + item.display + ss);
  inventory.updateDisplay();
},

smelt : function(){
  var fuel, input, fuel_object, input_object;
  var fuel_level = inventory.objects.blocks.furnace.fuel_level;
  fuel   = $("#smelt-fuel").attr('data-object');
  input  = $("#smelt-input").attr('data-object');
  fuel_object = inventory.getObject(fuel);
  input_object = inventory.getObject(input);
  if(!input || (!fuel && fuel_level.cur <= 0) || (fuel_level.cur <= 0 && fuel_object.fuel_source == undefined) || (input_object.cooks_to == undefined && input_object.smelts_to == undefined)){
    main.addAlert("Smelting stopped");
    inventory.smelting = false;
    $('#smelt').html('SMELT');
    return;
  }
  if($("#smelt-product").attr('data-object')){
    inventory.addObject($("#smelt-product").attr('data-object'),1);
    $("#smelt-product").removeAttr('data-object');
    $("#smelt-product").html('');
  }
  if(fuel_level.cur <= 0){
    fuel_level.max = fuel_object.fuel_source;
    fuel_level.cur = fuel_level.max;
    $('#fuel-line .bar').css('top',0);
    if(fuel_object.quantity >= 10){
      fuel_object.quantity -= 10;
    }else{
      $("#smelt-fuel").removeAttr('data-object');
      $("#smelt-fuel").html('');
    }
  }
  fuel_level.cur--;
  if(input_object.quantity >= 10){
    input_object.quantity -= 10;
  }else{
    $("#smelt-input").removeAttr('data-object');
    $("#smelt-input").html('');
  }
  $('#fuel-line .bar').animate({'top':90 - (90 / fuel_level.max) * fuel_level.cur},inventory.smelt_rate,'linear');
  $('#smelt-progress .bar').animate({'left': 0},inventory.smelt_rate,'linear',function(){
    $(this).css('left','-90px');
    var outBlock = (input_object.smelts_to) ? input_object.smelts_to : input_object.cooks_to;
    $("#smelt-product").attr('data-object',outBlock);
    $("#smelt-product").append($('#blocks .block.' + outBlock).clone());
    var reset_time = (fuel_level.cur == 0) ? 500 : 50;
    setTimeout(function(){buttons.smelt();},reset_time);
  });
  inventory.updateDisplay();
},

init : function(){
  $('#get-wood').on('click',function(){
    inventory.addObject('wood');
    $('#inventory').show();
    inventory.updateDisplay();
  });
  $('#make-planks').on('click',function(){
    if (inventory.canCraft('plank')) {
	  inventory.craft('plank');
	}
  });
  $('#make-crafting').on('click',function(){
    if (inventory.canCraft('crafting_table')) {
	  inventory.craft('crafting_table');
    main.addAlert('Made a Crafting Table!');
    main.addAlert('Click on items in your inventory to select them.');
    $('#start-buttons').slideUp();
	}
  });
  $('#get-villager').on('click',function(e){
    if(inventory.objects.items.apple.quantity >= villagers.cost){
      inventory.objects.items.apple.quantity -= villagers.cost;
      villagers.addVillager();
      villagers.cost *= 2;
      buttons.updateDisplay();
      inventory.updateDisplay();
      villagers.updateDisplay();
      if(villagers.population.length === 1){
        main.addAlert('Click a villager to assign it');
      }
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
      $(this).append($('#blocks .block.' + object).clone());
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
    if(inventory.smelting){
      main.addMouseAlert('Smelting in progress!',e);
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
      $(this).append($('#blocks .block.' + object).clone());
      $(this).attr('data-object',object);
      inventory.updateDisplay();
    }else{
      main.addMouseAlert('Not enough to smelt (10 required)!',e);
    }
  });
  $(".work-tab").on('click',function(){
    $('.page').hide();
  	$("#" + $(this).attr('data-for')).show();

	if($(this).attr('data-for')=="exploration")
		main.map_visible=true;
	else
		main.map_visible=false;

    $('.work-tab').removeClass('active');
    $(this).addClass('active');
    var craftSmelt = ['crafting','smelting'].indexOf($(this).attr('data-for')) > -1;
    buttons.setSidebarVisiblity('villagers',craftSmelt);
    buttons.setSidebarVisiblity('inventory',$(this).attr('data-for') !== 'exploration');
    var width = craftSmelt ? 500 : 800;
    $('#work-area').css('width',width);
  });

  $('#smelt').on('click',function(e){
    if(inventory.smelting){
      $('.smelt-square.input').each(function(){
        if($(this).attr('data-object')){
          $(this).html('');
          inventory.addObject($(this).attr('data-object'),10);
          $(this).removeAttr('data-object');
          inventory.updateDisplay();
        }
      });
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
    var input_object = inventory.getObject(input);
  	output = input_object.smelts_to ? input_object.smelts_to : input_object.cooks_to;
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
    $('#smelt').html('STOP');
    inventory.smelting = true;
  	buttons.smelt();
  });
  $('.craft').on('click',function(e){
    buttons.craftCount(parseInt($(this).attr('data-count')),e);
  });
  $('#clear').on('click',function(e){
    $('.craft-square').each(function(){
      var data = $(this).attr('data-object');
      if(data){
        inventory.addObject(data,10);
        $(this).html('');
        $(this).removeAttr('data-object');
      }
    });
  });
  $('.explore_move').on('click',function(){
    if(combat.inCombat) return;
    var x = $(this).attr('data-x');
    var y = $(this).attr('data-y');
    world.move(x,y);
  });
  $('#place-torch').on('click',function(e){
    if(inventory.getObject('torch').quantity < 10){
      main.addMouseAlert('You need 10 torches to light up the area',e);
      return;
    }
    if(!world.place('torch')){
      main.addMouseAlert("You can't place a torch there",e);
    }else{
      inventory.addObject('torch',-10);
    }
  });
  $('.building').on('click',function(){
    $('.building').removeClass('selected');
    $('.requirements').slideUp('fast');
    if($(this).hasClass('selected')){
      buildings.selected = null;
      return;
    }
    $(this).addClass('selected');
    $(this).find('.requirements').slideDown('fast');
    buildings.selected = $(this).attr('data-object');
  });
  $('#options').on('click', function(){
  	$('#options-menu').toggle();
  });
  $('#export').on('click', function(){
  	main.save();
  	$('#save-text').val(localStorage['save']);
  });
  $('#import').on('click', function(){
  	localStorage['save'] = $('#save-text').val();
  	main.load();
  });
  $('#clear-data').on('click', function(){
    if (confirm('Clear game progress?')) {
      delete localStorage['save'];
	  location.reload();
	}
  });
  $('#popup').on('click',function(e){
    e.stopPropagation();
  });
  $('body').on('keydown',function(e){
    if(main.map_visible && e.keyCode >= 37 && e.keyCode <= 40){
      if(combat.inCombat) return;
      // Because everyone loves stupid optimisation
      var x =  (e.keyCode % 2)      * (e.keyCode - 38);
      var y = ((e.keyCode % 2) - 1) * (e.keyCode - 39) * -1;
      $('.explore_move.' + x + '_' + y).click();
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    switch(e.keyCode){
      case 65: //A
        if(!combat.inCombat) return;
        $('#shade .fight').click();
        break;
      case 66: //B
        if(!combat.inCombat) return;
        if($('#shade .fight-ranged:visible').length < 1) return;
        $('#shade .fight-ranged').click();
        break;
      case 67: //C
        if($('#shade .close-button:visible').length < 1) return;
        $('#shade .close-button:visible').click();
        break;
      case 80: //P
        if(!main.map_visible) return;
        $('#place-torch').click();
        break;
      case 82: //R
        if(!combat.inCombat) return;
        $('#shade .run').click();
        break;
    }
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
    var slug = $(this).attr('data-id');
    var v = villagers.population[slug];
    if(!v.profession){
      main.selectedVillager = slug;
      main.showPopup('villager-assign');
      var el = $('#shade .villager-assign');
      el.find('.villager-name').html(v.name);
      el.find('.villager-choice').each(function(){
        if(!inventory.hasOwnedTool($(this).attr('data-tool'))){
          $(this).addClass('disabled');
          $(this).append('<div class="disabled-text">Unlock this villager type by crafting a ' + $(this).attr('data-tool') + '</div>');
        }
      });
      el.find('button').on('click',function(){
        villagers.assignProfession(slug,$(this).parent().parent().attr('data-choice'),1);
        $('#shade').hide();
      });
      return;
    }
    if(!inventory.selected){
      main.addMouseAlert("You must select an item to assign!",e);
      return;
    }
    var o = inventory.getObject(inventory.selected);
    if(o.quantity < 10){
      main.addMouseAlert('You must have 10 of an object to assign it',e);
      return;
    }
    if(v.profession == 'smith'      && o.smelts_to ||
       v.profession == 'builder'    && o.recipe    && !o.food ||
       v.profession == 'labourer'   && o.gives && !(inventory.selected.contains('sword') || inventory.selected.contains('bow')) ||
       v.profession == 'chef'       && (o.cooks_to || o.food && o.recipe) ||
       v.profession == 'adventurer' && o.mob_drop ){
      inventory.addObject(inventory.selected,-10);
      villagers.assignObject(slug,inventory.selected);
    }else{
      main.addMouseAlert('This villager can\'t work with that :(',e);
    }
  });
  $('.pause').on('click',function(e){
    var v = villagers.population[$(this).attr('data-id')];
    if(!v.profession){
      return;
    }
    e.stopPropagation();      
    if(!v.assigned){
      main.addMouseAlert('You must assign an item to a villager to enable it.',e);
      return;
    }
    v.enabled = !v.enabled;
    villagers.updateDisplay();
  });
},

hook_settlements : function(){
  $('.settlement').on('click',function(){
    settlements.selected = parseInt($(this).attr('data-id'));
    settlements.updateDisplay();
  });
  $('.settlement-grid').on('mouseenter',function(){
    settlements.drawHover(parseInt($(this).attr('data-x')),parseInt($(this).attr('data-y')));
  }).on('click',function(e){
    if(!$(this).hasClass('hover-green')){
      main.addMouseAlert("You can't build there",e);
      return;
    }
    var s = settlements.occupied[settlements.selected];
    var b = buildings.getBuilding(buildings.selected);
    var canBuild = buildings.canBuild(buildings.selected,s);
    if(!canBuild[0]){
      main.addMouseAlert(canBuild[1],e);
      return;
    }
    settlements.addBuilding(settlements.selected,buildings.selected,parseInt($(this).attr('data-x')),parseInt($(this).attr('data-y')));
    settlements.updateDisplay();
  });
  $('#grid').on('mouseleave',function(){
    settlements.noHover();
  });
},

hook_encounter : function(){
  var popup = $('#shade .encounter');
  popup.find('.fight').on('click',function(e){
    if($(this).hasClass('disabled')) return;
    combat.fight(false);
    $(this).addClass('disabled');
    var progress = $(this).find('.progress');
    progress.css('left','-100%');
    progress.show();
    progress.animate({'left':'0%'},300,function(){
      $(this).hide();
      if(combat.inCombat){
        $(this).parent().removeClass('disabled');
      }
    });
  });
  popup.find('.fight-ranged').on('click',function(e){
    if($(this).hasClass('disabled')) return;
    combat.fight(true);
    $(this).addClass('disabled');
    var progress = $(this).find('.progress');
    progress.css('left','-100%');
    progress.show();
    progress.animate({'left':'0%'},500,function(){
      $(this).hide();
      if(combat.inCombat){
        $(this).parent().removeClass('disabled');
      }
    });
  });
  popup.find('.run').on('click',function(e){
    combat.run();
  });
  popup.find('.close-button').on('click',function(){
    $('#shade').hide();
  });
},

hook_adventure: function(){
  var popup = $('#shade .adventure');
  popup.find('.move_adventure').on('click',function(){
    if($(this).hasClass('disabled')) return;
    adventure.go($(this).attr('data-direction'));
  });
  popup.find('.close-button').on('click',function(){
    $('#shade').hide();
  });
},

updateDisplay : function(){
  if(inventory.objects.blocks.wood.hasOwned){
    $('#make-planks').show();
    if(main.inventory_visible) $('#inventory').show();
  }
  if(inventory.objects.blocks.plank.hasOwned){
    $('#make-crafting').show();
  }
  if(inventory.objects.blocks.crafting_table.hasOwned){
    $('#work-area').show();
    if($('.work-tab.active').length === 0){
      $('#crafting').show();
    }
    $('#start-buttons').hide();
  }
  if(inventory.objects.blocks.furnace.hasOwned){
    $('#tab-crafting').show();
    $('#tab-smelting').show();
    if($('.work-tab.active').length !== 1){
      $('#tab-crafting').addClass('active');
    }
  }
  if(combat.unlocked()){
    $('#tab-crafting').show();
    $('#tab-exploration').show();
    if($('.work-tab.active').length !== 1){
      $('#tab-crafting').addClass('active');
    }
  }
  if(settlements.occupied.length > 0){
    $('#tab-settlements').show();
  }
  if(inventory.objects.items.apple.hasOwned){
    $('#get-villager').show();
    $('#get-villager').html('Get a villager (' + villagers.cost + ' apple' + ((villagers.cost > 1) ? 's' : '') + ')');
  }
},

setSidebarVisiblity : function(bar,visiblity){
  main[bar + '_visible'] = visiblity;
  if(visiblity){
    $('#' + bar).show();
  }else{
    $('#' + bar).hide();
  }
}

};

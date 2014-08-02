var buttons = {

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
  $('#craft').on('click',function(e){
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
    for(var group in inventory.objects){
      for(var object in inventory.objects[group]){
        if(inventory.objects[group][object].recipe == code){
          inventory.addObject(object,inventory.objects[group][object].yield);
          // Try to 'pull in' more ingredients
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
          var aa = '';
          var ss = '';
          if(inventory.objects[group][object].yield){
            aa = inventory.objects[group][object].yield + ' ';
            ss = 's';
          }else{
            aa = (['A','E','I','O','U'].indexOf(inventory.objects[group][object].display[0]) > -1) ? 'an ' : 'a ';
          }
          main.addAlert('Crafted ' + aa + inventory.objects[group][object].display + ss);
          inventory.updateDisplay();
          return;
        }
      }
    }
    main.addMouseAlert('Not a valid crafting recipe :(',e);
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
    if(inventory.selected && inventory.in('tools',inventory.selected)){
      if(inventory.getObject(inventory.selected).quantity >= 10){
        inventory.addObject(inventory.selected,-10);
        villagers.assignProfession($(this).attr('data-id'),inventory.getObject(inventory.selected).profession,inventory.getObject(inventory.selected).bonus)
      }else{
        main.addMouseAlert('You must have 10 of a tool to assign.',e);
      }
    }else{
      var v = villagers.population[$(this).attr('data-id')];
      if(v.profession){
        // work out what to do with this object
      }else{
        main.addMouseAlert('Select a tool to assign a villager.',e);
      }
    }
  });
  $('.pause').on('click',function(e){
    e.stopPropagation();
    villagers.population[$(this).attr('data-id')].enabled = !villagers.population[$(this).attr('data-id')].enabled;
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

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
    var value = inventory.objects.blocks.crafting_table.hasOwned ? 4 : 10;
    if(inventory.objects.blocks.wood.quantity >= value){
      inventory.objects.blocks.wood.quantity -= value;
      inventory.addObject('planks');
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
      $('#crafting').show();
      $('#make-planks').html('Make Planks (4 wood)');
      main.addAlert('Made a Crafting Table!');
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
  $('.smelt-square').on('click',function(e){
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
  $("#lnkCrafting").on('click',function(){
	main.hideTables();
	$("#crafting").show();
  });
  $("#lnkSmelting").on('click',function(){
	main.hideTables();
	$("#smelting").show();
  });
  $('#craft').on('click',function(){
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
        }
      }
    }
  });
  $('#smelt').on('click',function(){
	var fuel, input, output;
	fuel=$("#smelt_1").attr('data-object');
	input=$("#smelt_0").attr('data-object');
	if(inventory.objects.blocks.furnace.fuelLevel<=0){
	  inventory.objects.blocks.furnace.fuelLevel=10;
	}
  });
  // init button states
  if(inventory.objects.blocks.wood.hasOwned){
    $('#make-planks').show();
    $('#inventory').show();
  }
  if(inventory.objects.blocks.planks.hasOwned){
    $('#make-crafting').show();
  }
  if(inventory.objects.blocks.crafting_table.hasOwned){
    $('#crafting').show();
    $('#lnkCrafting').show();
  }
  if(inventory.objects.blocks.crafting_table.hasOwned){
    $('#lnkSmelting').show();
  }
  this.hook_inventory();
  this.hook_villagers();
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
      if(inventory.get(inventory.selected).quantity >= 10){
        inventory.addObject(inventory.selected,-10);
        villagers.assignVillager($(this).attr('data-name'),inventory.get(inventory.selected).profession,inventory.get(inventory.selected).bonus)
      }else{
        main.addMouseAlert('You must have 10 of a tool to assign.',e);
      }
    }else{
      main.addMouseAlert('Select a tool to assign a villager.',e);
    }
  });
}

};

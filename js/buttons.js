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
  $('#craft').on('click',function(){
    var code = '';
    $('.craft-square').each(function(){
      if($(this).attr('data-object')){
        code += inventory.getObject($(this).attr('data-object')).symbol;
      }else{
        code += ' ';
      }
    });
    code = code.trim();
    for(var group in inventory.objects){
      for(var object in inventory.objects[group]){
        if(inventory.objects[group][object].recipe == code){
          inventory.addObject(object,inventory.objects[group][object].yield);
          inventory.updateDisplay();
          $('.craft-square').removeAttr('data-object');
          $('.craft-square').html("");
          main.addAlert('Crafted a ' + inventory.objects[group][object].display);
        }
      }
    }
  });
  this.hook_inventory();
},

hook_inventory : function(){
  $('.inventory-item').on('click',function(){
    $('.inventory-item').removeClass('selected');
    $(this).addClass('selected');
    inventory.selected = $(this).attr('data-object');
  });
}

};

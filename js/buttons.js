var buttons = {

init : function(){
  $('#get-wood').on('click',function(){
    inventory.addBlock('wood');
    $('#inventory').show();
    inventory.updateDisplay();
    if(inventory.blocks.wood.quantity >= 10){
      $('#make-planks').show();
    }
  });
  $('#make-planks').on('click',function(){
    var value = inventory.blocks.crafting_table.hasOwned ? 4 : 10;
    if(inventory.blocks.wood.quantity >= value){
      inventory.blocks.wood.quantity -= value;
      inventory.addBlock('planks');
      inventory.updateDisplay();
      if(inventory.blocks.planks.quantity >= 4){
        $('#make-crafting').show();
      }
    }
  });
  $('#make-crafting').on('click',function(){
    if(inventory.blocks.planks.quantity >= 4){
      inventory.blocks.planks.quantity -= 4;
      inventory.addBlock('crafting_table');
      inventory.updateDisplay();
      $('#crafting').show();
    }
  });
  $('.craft-square').on('click',function(){
    if($(this).attr('data-block')){
      $(this).html("");
      inventory.blocks[$(this).attr('data-block')].quantity += 10;
      $(this).removeAttr('data-block');
      inventory.updateDisplay();
      return;
    }
    var block = inventory.selected;
    if(block === undefined){
      return;
    }
    if(inventory.blocks[block].quantity >= 10){
      inventory.blocks[block].quantity -= 10;
      $(this).html(inventory.blocks[block].symbol);
      $(this).attr('data-block',block);
      inventory.updateDisplay();
    }
  });
  $('#craft').on('click',function(){
    var code = '';
    $('.craft-square').each(function(){
      if($(this).attr('data-block')){
        code += inventory.blocks[$(this).attr('data-block')].symbol;
      }else{
        code += ' ';
      }
    });
    console.log(code);
    code = code.trim();
    var allCraftables = $.extend({},inventory.blocks,inventory.items,inventory.tools,inventory.armour);
    for(block in allCraftables){
      if(allCraftables[block].recipe == code){
        inventory.craft(block);
        inventory.updateDisplay();
      }
    }
  });
  this.hook_inventory();
},

hook_inventory : function(){
  $('.inventory-item').on('click',function(){
    $('.inventory-item').removeClass('selected');
    $(this).addClass('selected');
    inventory.selected = $(this).attr('data-block');
  });
}

};

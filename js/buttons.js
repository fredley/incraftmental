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
      inventory.blocks.wood.quantity -= 4;
      inventory.addBlock('crafting_table');
      inventory.updateDisplay();
      $('#crafting').show();
    }
  });
}

};

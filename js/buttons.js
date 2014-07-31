var buttons = {

init : function(){
  $('#get-wood').on('click',function(){
    inventory.addBlock('wood');
    $('#inventory').show();
    inventory.updateDisplay();
  });
}

};

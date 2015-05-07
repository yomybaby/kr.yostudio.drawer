function onMenuButtonClick(e){
    $.index.toggleLeftView();
}

function onDrawerOpen(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

function onDrawerClose(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

$.menuC.on('menuclick',function(e){
    $.index.toggleLeftView({animated:false}); //animated option only work on ios
    
    switch(e.itemId){
      case 'smile':
      case 'cry':
        $.index.openWindow(Alloy.createController(e.itemId).getView());
      break;
      
      default:
        $.index.setCenterView(Alloy.createController(e.itemId).getView()); //Arg shold be View(not window)
      break;
    }
});

$.index.open();

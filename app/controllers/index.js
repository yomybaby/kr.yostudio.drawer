function onMenuButtonClick(e){
    $.index.drawer.toggleLeftWindow();
}

function onDrawerOpen(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

function onDrawerClose(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

function onDrawerSlide(e) {
    // slide offset: e.offset
    console.log(e);
}

$.menuC.on('menuclick',function(e){
    $.index.drawer.toggleLeftWindow({animated:false}); //animated option only work on ios
    if(e.itemId == 'smile'){
        $.index.openWindow(Alloy.createController('smile').getView());
    }else{
        $.index.openWindow(Alloy.createController('cry').getView());
    }
});

$.index.open();

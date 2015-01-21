function onMenuButtonClick(e){
    $.index.toggleLeftView();
}

function onDrawerOpen(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

function onDrawerClose(e) {
    Ti.API.info($.index.isLeftDrawerOpen);
}

// function onDrawerSlide(e) { //not supported yet.
    // slide offset: e.offset 
    // console.log(e);
// }

$.menuC.on('menuclick',function(e){
    $.index.toggleLeftView({animated:false}); //animated option only work on ios
    if(e.itemId == 'smile'){
        $.index.openWindow(Alloy.createController('smile').getView());
    }else{
        $.index.openWindow(Alloy.createController('cry').getView());
    }
});

$.index.open();

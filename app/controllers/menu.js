var args = arguments[0] || {};

$.listView.addEventListener('itemclick', function(e) {
    $.trigger('menuclick',e);
});
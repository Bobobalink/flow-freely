var LP = LP || {};
LP.drawing = null;
LP.lastHex = null;

LP.onClick = function (event) {
    var mousePoint = new HT.Point(event.pageX, event.pageY);
    var hex = grid.GetHexAt(mousePoint);
    if(LP.drawing) {
        LP.drawing = null;
        // this would be the logical place to check for connectivity, if we care about that...
    } else {
        LP.drawing = dots[hex.Id];
        LP.lastHex = hex;
    }
};

LP.onMouseMove = function (event) {
    var mousePoint = new HT.Point(event.pageX, event.pageY);
    var hex = grid.GetHexAt(mousePoint);
    if(!LP.drawing) return;
    if(hex.Id == LP.lastHex.Id) return;
    LP.drawing.connections.push(hex);
    console.log(LP.drawing.connections);
    LP.lastHex = hex;
    drawThings();
};

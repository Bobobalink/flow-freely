var LP = LP || {};
LP.drawing = null;
LP.lastHex = null;

LP.onClick = function (event) {
    var mousePoint = new HT.Point(event.pageX, event.pageY);
    var hex = grid.GetHexAt(mousePoint);
    if (LP.drawing) {
        LP.drawing = null;
        // this would be the logical place to check for connectivity, if we care about that...
    } else {
        LP.drawing = dots[hex.Id];
        if(!LP.drawing) {
            for(var dot in dots) {
                if(!dots.hasOwnProperty(dot)) continue;
                if(dots[dot].connections.indexOf(hex) >= 0) {
                    LP.drawing = dots[dot];
                    break;
                }
            }
        }

        if (LP.drawing.connections.length > 0)
            LP.lastHex = LP.drawing.connections[LP.drawing.connections.length - 1];
        else
            LP.lastHex = hex;
    }
};

LP.onMouseMove = function (event) {
    var mousePoint = new HT.Point(event.pageX, event.pageY);
    var hex = grid.GetHexAt(mousePoint);
    if (!hex) return;
    if (!LP.drawing) return;
    if (hex.Id == LP.lastHex.Id) return;
    var indOf = LP.drawing.connections.indexOf(hex);
    if (indOf != -1) {
        LP.drawing.connections.splice(indOf + 1);
    } else if (hex.Id == LP.drawing.hex.Id) {
        LP.drawing.connections = [];
    } else {
        if (grid.GetHexDistance(hex, LP.lastHex) != 1) return;
        for (var dot in dots) {
            if (!dots.hasOwnProperty(dot)) continue;
            if (dots[dot].label == LP.drawing.label) {
                if (dots[dot].hex.Id == hex.Id) {
                    dots[dot].connections = [];
                    break;
                }
                indOf = dots[dot].connections.indexOf(hex);
                if (indOf != -1) {
                    dots[dot].connections.splice(indOf + 1);
                    LP.drawing.connections.push.apply(LP.drawing.connections, dots[dot].connections.reverse());
                    LP.drawing.connections.push(dots[dot].hex);
                    dots[dot].connections = [];
                    LP.drawing = null;
                    drawThings();
                    return;
                }
            }
            if (dots[dot].hex.Id == hex.Id) return;
            indOf = dots[dot].connections.indexOf(hex);
            if (indOf != -1) {
                dots[dot].connections.splice(indOf);
                break; // shouldn't be more than one connection
            }
        }
        LP.drawing.connections.push(hex);
    }
    LP.lastHex = hex;
    drawThings();
    console.log(LP.drawing.connections);
};

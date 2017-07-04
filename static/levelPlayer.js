var LP = LP || {};
LP.drawing = null;
LP.lastHex = null;
LP.watchHexes = {};

LP.onClick = function (event) {
    var mousePoint = new HT.Point(event.pageX, event.pageY);
    var hex = grid.GetHexAt(mousePoint);
    if (!hex) return;
    if (LP.drawing) {
        LP.drawing = null;
        LP.watchHexes = {};
        // this would be the logical place to check for connectivity, if we care about that...
    } else {
        LP.drawing = dots[hex.Id];
        if (LP.drawing) {  // if the cursor is actually over a dot
            LP.drawing.connections = [];
        } else {
            for (var dot in dots) {
                if (!dots.hasOwnProperty(dot)) continue;
                if(dots[dot].connections.length <= 0) continue;  // if the line is empty
                var indOf = dots[dot].connections.indexOf(hex);
                if (indOf == dots[dot].connections.length - 1) {  // if the cursor is over the tip of a line
                    LP.drawing = dots[dot];
                    break;
                } else if (indOf >= 0) {  // if the cursor is somewhere else along the line
                    LP.drawing = dots[dot];
                    LP.drawing.connections.splice(indOf + 1);
                }
            }
        }

        LP.lastHex = hex;
    }
};

LP.onMouseMove = function (event) {
    var mousePoint = new HT.Point(event.pageX, event.pageY);
    var hex = grid.GetHexAt(mousePoint);
    if (!hex) return;
    if (!LP.drawing) return;
    if (hex.Id == LP.lastHex.Id) return;  // if the cursor didn't change hex
    if (grid.GetHexDistance(hex, LP.lastHex) != 1) return;  // if the cursor jumped more than one hex (lag or something)
    console.log(LP.watchHexes, LP.lastHex.Id);
    var indOf = LP.drawing.connections.indexOf(hex);
    if (indOf != -1) {  // if the cursor is over a hex already in the same line that's being drawn
        LP.drawing.connections.splice(indOf + 1);
        if (LP.watchHexes[LP.lastHex.Id] && LP.drawing.connections.indexOf(LP.lastHex) < 0) {
            console.log("watched " + LP.lastHex.Id);
            LP.watchHexes[LP.lastHex.Id].connections.push.apply(LP.watchHexes[LP.lastHex.Id].connections, LP.watchHexes[LP.lastHex.Id].tail);
            delete LP.watchHexes[LP.lastHex.Id];
        }
    } else if (hex.Id == LP.drawing.hex.Id) {  // if the cursor is over the originating dot
        LP.drawing.connections = [];
    } else {
        for (var dot in dots) {
            if (!dots.hasOwnProperty(dot)) continue;  // something something javascript
            if (dots[dot].label == LP.drawing.label) {
                if (dots[dot].hex.Id == hex.Id) {  // if the cursor is over the other dot of the same color
                    dots[dot].connections = [];  // kill the other dot's path and draw into it
                    break;
                }
                indOf = dots[dot].connections.indexOf(hex);
                if (indOf != -1) {  // if the cursor is over the other line of the same color
                    // join the two lines together, making the whole path "owned" by the path currently being drawn by the user
                    dots[dot].connections.splice(indOf + 1);
                    LP.drawing.connections.push.apply(LP.drawing.connections, dots[dot].connections.reverse());
                    LP.drawing.connections.push(dots[dot].hex);
                    dots[dot].connections = [];
                    LP.drawing = null;  // automatically stop drawing... TODO: confusing?
                    drawThings();
                    return;
                }
            }
            if (dots[dot].hex.Id == hex.Id) return;  // if the cursor is over a dot of another color, don't draw
            indOf = dots[dot].connections.indexOf(hex);
            if (indOf != -1) {  // if the cursor is over a line of another color
                dots[dot].tail = dots[dot].connections.splice(indOf);  // cut that line at the point of intersection
                LP.watchHexes[hex.Id] = dots[dot];
                break;
            }
        }
        LP.drawing.connections.push(hex);
    }
    LP.lastHex = hex;
    drawThings();
    // console.log(LP.drawing.connections);
};

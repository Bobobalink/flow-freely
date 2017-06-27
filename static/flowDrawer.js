var flowDots = flowDots || {};
flowDots.Static = {};
flowDots.Static.RADIUS = 32;
flowDots.Static.LINE_WIDTH = 27;
flowDots.Static.DRAW_LABELS = true;
// lovingly hand-stolen from https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
flowDots.Static.COLORS = {
    "A": "#e6194b",
    "B": "#3cb44b",
    "C": "#ffe119",
    "D": "#0082c8",
    "E": "#f58231",
    "F": "#911eb4",
    "G": "#000080",
    "H": "#f032e6",
    "I": "#26f510",
    "J": "#fabebe",
    "K": "#008080",
    "L": "#e6beff",
    "M": "#aa6e28",
    "N": "#800000",
    "O": "#808000",
    "P": "#ffd8b1",
    "Q": "#46f0f0",
    "R": "#808080",
    "S": "#000000"
};
flowDots.Static.label_color = "#ffffff";
flowDots.Dot = function (hex, label) {
    this.hex = hex;
    this.label = label;
    this.connections = [];
};

flowDots.Dot.prototype.drawLines = function (drawer) {
    drawer.lineWidth = flowDots.Static.LINE_WIDTH;
    for (var i in this.connections) {
        drawer.strokeStyle = flowDots.Static.COLORS[this.label];
        drawer.beginPath();
        if (i == 0) {
            drawer.moveTo(this.hex.MidPoint.X, this.hex.MidPoint.Y);
            // console.log("(" + this.label + ") begin: " + this.hex.MidPoint.X + ", " + this.hex.MidPoint.Y);
        } else {
            drawer.moveTo(this.connections[i - 1].MidPoint.X, this.connections[i - 1].MidPoint.Y);
            // console.log("(" + this.label + ") begin: " + this.connections[i - 1].MidPoint.X + ", " + this.connections[i - 1].MidPoint.Y);
        }
        drawer.lineTo(this.connections[i].MidPoint.X, this.connections[i].MidPoint.Y);
        // console.log("(" + this.label + ") end: " + this.connections[i].MidPoint.X + ", " + this.connections[i].MidPoint.Y);
        drawer.stroke();
        drawer.fillStyle = flowDots.Static.COLORS[this.label];
        drawer.beginPath();
        drawer.arc(this.connections[i].MidPoint.X, this.connections[i].MidPoint.Y, flowDots.Static.LINE_WIDTH / 2, 0, 2 * Math.PI);
        drawer.closePath();
        drawer.fill();
    }
};

flowDots.Dot.prototype.drawBlobs = function (drawer) {
    drawer.fillStyle = flowDots.Static.COLORS[this.label];
    drawer.beginPath();
    drawer.arc(this.hex.MidPoint.X, this.hex.MidPoint.Y, flowDots.Static.RADIUS, 0, 2 * Math.PI);
    drawer.closePath();
    drawer.fill();
    if (flowDots.Static.DRAW_LABELS) {
        drawer.fillStyle = flowDots.Static.label_color;
        drawer.font = "bolder 14pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
        drawer.textAlign = "center";
        drawer.textBaseline = 'middle';
        drawer.fillText(this.label, this.hex.MidPoint.X, this.hex.MidPoint.Y);
    }
};


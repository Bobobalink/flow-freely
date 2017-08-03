import * as HT from "HexagonToolTs"
import * as HG from "HexagonGridTs"

export class FlowDot {
    public static LINE_WIDTH: number = 27;
    public static RADIUS: number = 32;
    public static DRAW_LABELS: boolean = true;
    public static COLORS: { [key: string]: string } = {
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
    public static LABEL_COLOR = "#ffffff";

    public hex: HT.Hexagon;
    public label: string;
    public connections: HT.Hexagon[];

    public constructor(hex: HT.Hexagon, label: string) {
        this.hex = hex;
        this.label = label;
        this.connections = [];
    }

    public drawLines(drawer: CanvasRenderingContext2D) {
        drawer.lineWidth = FlowDot.LINE_WIDTH;
        for (let h in this.connections) {
            let i = parseInt(h);  // apparently typescript doesn't get rid of all the stupidity in javascript...
            drawer.strokeStyle = FlowDot.COLORS[this.label];
            drawer.beginPath();
            if (i == 0) {
                drawer.moveTo(this.hex.midPoint.x, this.hex.midPoint.y);
            } else {
                drawer.moveTo(this.connections[i - 1].midPoint.x, this.connections[i - 1].midPoint.y);
            }
            drawer.lineTo(this.connections[i].midPoint.x, this.connections[i].midPoint.y);
            drawer.stroke();
            drawer.fillStyle = FlowDot.COLORS[this.label];
            drawer.beginPath();
            drawer.arc(this.connections[i].midPoint.x, this.connections[i].midPoint.y, FlowDot.LINE_WIDTH / 2, 0, 2 * Math.PI);
            drawer.closePath();
            drawer.fill();
        }
    }

    public drawBlobs(drawer: CanvasRenderingContext2D) {
        drawer.fillStyle = FlowDot.COLORS[this.label];
        drawer.beginPath();
        drawer.arc(this.hex.midPoint.x, this.hex.midPoint.y, FlowDot.RADIUS, 0, 2 * Math.PI);
        drawer.closePath();
        drawer.fill();
        if (FlowDot.DRAW_LABELS) {
            drawer.fillStyle = FlowDot.LABEL_COLOR;
            drawer.font = "bolder 14pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            drawer.textAlign = "center";
            drawer.textBaseline = 'middle';
            drawer.fillText(this.label, this.hex.midPoint.x, this.hex.midPoint.y);
        }
    }
}

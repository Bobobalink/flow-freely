import {FlowDot} from "./FlowDot";
import {Hexagon, Point} from "./HexagonTool";
import {Data} from "./Data";

export class LevelPlayer {
    private data: Data;

    private currentDot: FlowDot | null = null;
    private lastHex: Hexagon;
    private watchHexes: { [index: string]: FlowDot } = {};
    private tails: { [index: string]: Hexagon[] } = {};

    public constructor(data: Data) {
        this.data = data;
    }

    private onClickBound = this.onClick.bind(this);

    private onClick(event: HTMLElementEventMap['click']) {
        console.log("LevelPlayer Click");
        let mousePoint = new Point(event.pageX, event.pageY);
        let hex = this.data.grid.getHexAt(mousePoint);
        if (!hex) return;
        if (this.currentDot) {
            this.currentDot = null;
            this.watchHexes = {};
        } else {
            this.currentDot = this.data.dots[hex.ID];
            if (this.currentDot) {  // if the cursor is actually over a dot
                this.currentDot.connections = [];
            } else {
                for (let dot in this.data.dots) {
                    if (this.data.dots[dot].connections.length == 0) continue;  // if the line is empty
                    let indOf = this.data.dots[dot].connections.indexOf(hex);
                    if (indOf == this.data.dots[dot].connections.length - 1) {  // if the cursor is over the tip of a line
                        this.currentDot = this.data.dots[dot];
                        break;
                    } else if (indOf >= 0) {  // if the cursor is somewhere else along the line
                        this.currentDot = this.data.dots[dot];
                        this.currentDot.connections.splice(indOf + 1);
                    }
                }
            }
        }
        this.lastHex = hex
    }

    private onMouseMoveBound = this.onMouseMove.bind(this);

    private onMouseMove(event: HTMLElementEventMap['mousemove']) {
        if (!this.currentDot) return;

        let mousePoint = new Point(event.pageX, event.pageY);
        let hex = this.data.grid.getHexAt(mousePoint);

        if (!hex) return;
        if (hex.ID == this.lastHex.ID) return;  // if the cursor didn't change hex
        if (this.data.grid.gridDistBetween(hex, this.lastHex) != 1) return;  // if the cursor jumped more than one hex (lag or something)

        let indOf = this.currentDot.connections.indexOf(hex);
        if (indOf != -1) {  // if the cursor is over a hex already in the same line that's being drawn
            this.currentDot.connections.splice(indOf + 1);
            if (this.watchHexes[this.lastHex.ID] && this.currentDot.connections.indexOf(this.lastHex) < 0) {
                console.log("watched " + this.lastHex.ID);
                this.watchHexes[this.lastHex.ID].connections.push.apply(this.watchHexes[this.lastHex.ID].connections, this.tails[this.lastHex.ID]);
                delete this.watchHexes[this.lastHex.ID];
                delete this.tails[this.lastHex.ID];
            }
        } else if (hex.ID == this.currentDot.hex.ID) {  // if the cursor is over the originating dot
            this.currentDot.connections = [];
        } else {
            for (let dot in this.data.dots) {
                if (this.data.dots[dot].label == this.currentDot.label) {
                    if (this.data.dots[dot].hex.ID == hex.ID) {  // if the cursor is over the other dot of the same color
                        this.data.dots[dot].connections = [];
                        break;
                    }
                    indOf = this.data.dots[dot].connections.indexOf(hex);
                    if (indOf != -1) {  // if the cursor is over the other line of the same color
                        // join the two lines together, making the whole path "owned" by the path currently being drawn by the user
                        this.data.dots[dot].connections.splice(indOf + 1);
                        this.currentDot.connections.push.apply(this.currentDot.connections, this.data.dots[dot].connections.reverse());
                        this.currentDot.connections.push(this.data.dots[dot].hex);
                        this.data.dots[dot].connections = [];
                        this.currentDot = null;    // automatically stop drawing... TODO: confusing?
                        this.data.updateCanvas();
                        return;
                    }
                }
                if(this.data.dots[dot].hex.ID == hex.ID) return;  // if the cursor is over a dot of another color, don't draw
                indOf = this.data.dots[dot].connections.indexOf(hex);
                if(indOf != -1) {  // if the cursor is over a line of another color
                    this.tails[hex.ID] = this.data.dots[dot].connections.splice(indOf);  // cut that line at the point of intersection
                    this.watchHexes[hex.ID] = this.data.dots[dot];
                    break;
                }
            }
        this.currentDot.connections.push(hex);
        }
        this.lastHex = hex;
        this.data.updateCanvas();
    }

    public start() {
        this.data.canvas.addEventListener("click", this.onClickBound, false);
        this.data.canvas.addEventListener("mousemove", this.onMouseMoveBound, false);
    }

    public stop() {
        this.data.canvas.removeEventListener("click", this.onClickBound, false);
        this.data.canvas.removeEventListener("mousemove", this.onMouseMoveBound, false);
    }
}

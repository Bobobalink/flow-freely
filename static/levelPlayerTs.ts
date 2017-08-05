import {BaseHexGrid} from "./HexagonGridTs";
import {FlowDot} from "./FlowDot";
import {Hexagon, Point} from "./HexagonToolTs";

export class LevelPlayer {
    private grid: BaseHexGrid;
    private dots: { [index: string]: FlowDot };
    private currentDot: FlowDot | null = null;
    private lastHex: Hexagon;
    private watchHexes: { [index: string]: FlowDot } = {};
    private tails: { [index: string]: Hexagon[] } = {};

    private canvas: HTMLCanvasElement | null = null;
    private draw: ((drawer: CanvasRenderingContext2D) => void) | null = null;

    public constructor(grid: BaseHexGrid, dots: { [index: string]: FlowDot }) {
        this.grid = grid;
        this.dots = dots;
    }

    private onClick(event: HTMLElementEventMap['click']) {
        let mousePoint = new Point(event.pageX, event.pageY);
        let hex = this.grid.getHexAt(mousePoint);
        if (!hex) return;
        if (this.currentDot) {
            this.currentDot = null;
            this.watchHexes = {};
        } else {
            this.currentDot = this.dots[hex.ID];
            if (this.currentDot) {  // if the cursor is actually over a dot
                this.currentDot.connections = [];
            } else {
                for (let dot in this.dots) {
                    if (this.dots[dot].connections.length == 0) continue;  // if the line is empty
                    let indOf = this.dots[dot].connections.indexOf(hex);
                    if (indOf == this.dots[dot].connections.length - 1) {  // if the cursor is over the tip of a line
                        this.currentDot = this.dots[dot];
                        break;
                    } else if (indOf >= 0) {  // if the cursor is somewhere else along the line
                        this.currentDot = this.dots[dot];
                        this.currentDot.connections.splice(indOf + 1);
                    }
                }
            }
        }
        this.lastHex = hex
    }

    private onMouseMove(event: HTMLElementEventMap['mousemove']) {
        if (!this.currentDot) return;
        if (!this.draw || !this.canvas) return;
        let drawer = this.canvas.getContext('2d');
        if(!drawer) return;

        let mousePoint = new Point(event.pageX, event.pageY);
        let hex = this.grid.getHexAt(mousePoint);

        if (!hex) return;
        if (hex.ID == this.lastHex.ID) return;  // if the cursor didn't change hex
        if (this.grid.gridDistBetween(hex, this.lastHex) != 1) return;  // if the cursor jumped more than one hex (lag or something)

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
            for (let dot in this.dots) {
                if (this.dots[dot].label == this.currentDot.label) {
                    if (this.dots[dot].hex.ID == hex.ID) {  // if the cursor is over the other dot of the same color
                        this.dots[dot].connections = [];
                        break;
                    }
                    indOf = this.dots[dot].connections.indexOf(hex);
                    if (indOf != -1) {  // if the cursor is over the other line of the same color
                        // join the two lines together, making the whole path "owned" by the path currently being drawn by the user
                        this.dots[dot].connections.splice(indOf + 1);
                        this.currentDot.connections.push.apply(this.currentDot.connections, this.dots[dot].connections.reverse());
                        this.currentDot.connections.push(this.dots[dot].hex);
                        this.dots[dot].connections = [];
                        this.currentDot = null;    // automatically stop drawing... TODO: confusing?
                        this.draw(drawer);
                        return;
                    }
                }
                if(this.dots[dot].hex.ID == hex.ID) return;  // if the cursor is over a dot of another color, don't draw
                indOf = this.dots[dot].connections.indexOf(hex);
                if(indOf != -1) {  // if the cursor is over a line of another color
                    this.tails[hex.ID] = this.dots[dot].connections.splice(indOf)  // cut that line at the point of intersection
                    this.watchHexes[hex.ID] = this.dots[dot];
                    break;
                }
            }
        this.currentDot.connections.push(hex);
        }
        this.lastHex = hex;
        this.draw(drawer);
    }

    public start(canvas: HTMLCanvasElement, draw: (drawer: CanvasRenderingContext2D) => void) {
        this.canvas = canvas;
        this.draw = draw;
        canvas.addEventListener("click", this.onClick.bind(this), false);
        canvas.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    }

    public stop(canvas: HTMLCanvasElement) {
        this.canvas = null;
        this.draw = null;
        canvas.removeEventListener("click", this.onClick.bind(this), false);
        canvas.removeEventListener("mousemove", this.onClick.bind(this), false);
    }
}

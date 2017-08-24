import {BaseHexGrid, FlowGridNormal} from "./HexagonGrid";
import {FlowDot} from "./FlowDot";
import {LevelPlayer} from "./levelPlayer";
import {LevelCreator} from "./levelCreator";
import {UI} from "./UI";

// this feels like a hack, even though it's better than any alternatives I've thought of
// If I have offended the gods for bad practice, please know that I was already going to hell
export class Data {
    public canvas: HTMLCanvasElement;
    public drawer: CanvasRenderingContext2D;
    public grid: BaseHexGrid;
    public dots: {[index: string]: FlowDot};
    public levelPlayer: LevelPlayer;
    public levelCreator: LevelCreator;
    public UI: UI;

    public constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("hexes");
        let tmp = this.canvas.getContext("2d");
        if(!tmp) return;
        this.drawer = tmp;
        this.grid = new FlowGridNormal(this.canvas.width * 0.95, this.canvas.height * 0.95, 7);
        this.dots = {};
        this.levelPlayer = new LevelPlayer(this);
        this.levelCreator = new LevelCreator(this);
        this.UI = new UI(this);
    }

    public updateCanvas() {
        let drawer = this.canvas.getContext("2d");
        if(!drawer) return;
        drawer.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let h in this.grid.hexes) {
            this.grid.hexes[h].draw(drawer);
        }
        for (let i in this.dots) {
            this.dots[i].drawLines(drawer);
        }
        for (let i in this.dots) {
            this.dots[i].drawBlobs(drawer);
        }
    }
}

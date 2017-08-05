import * as HG from "./HexagonGrid";
import {FlowDot} from "./FlowDot";
import {LevelCreator} from "./levelCreator";
import {LevelPlayer} from "./levelPlayer";

function main() {
    let canvas = <HTMLCanvasElement>document.getElementById("hexes");
    let drawer = canvas.getContext("2d");
    if(!drawer) return;
    drawer.fillStyle = "#ffffff";
    drawer.fillRect(0, 0, canvas.width, canvas.height);
    let grid = new HG.FlowGridNormal(canvas.width * 0.95, canvas.height * 0.95, 9);
    FlowDot.LINE_WIDTH = grid.hexes[0].width * 0.38;
    FlowDot.RADIUS = grid.hexes[0].width * 0.32;


    let dots: {[index: string]: FlowDot} = {};

    let LC = new LevelCreator(grid, dots, FlowDot.COLORS);
    let LP = new LevelPlayer(grid, dots);

    function drawThings(drawer: CanvasRenderingContext2D) {
        drawer.clearRect(0, 0, canvas.width, canvas.height);
        for (let h in grid.hexes) {
            grid.hexes[h].draw(drawer);
        }
        for (let i in dots) {
            dots[i].drawLines(drawer);
        }
        for (let i in dots) {
            dots[i].drawBlobs(drawer);
        }
    }

    drawThings(drawer);

    function switchMode(event: HTMLElementEventMap["click"]) {
        let button = <HTMLButtonElement>event.target;
        if (button.value == "Play") {
            button.value = "Edit";

            LC.stop();
            LP.start(canvas, drawThings);
        } else {
            button.value = "Play";

            LP.stop(canvas);
            LC.start(canvas, drawThings);

        }
    }

    let button = <HTMLButtonElement>document.getElementById("toggleButton");
    button.addEventListener("click", switchMode, false);


    LC.start(canvas, drawThings);

    drawThings(drawer);
}

main();

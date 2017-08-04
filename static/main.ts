import * as HG from "./HexagonGridTs";
import {FlowDot} from "./FlowDot";
import {LevelCreator} from "./levelCreatorTs";

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

//     dots["A1"] = new flowDots.Dot(grid.GetHexById("A1"), "A");
//     dots["A5"] = new flowDots.Dot(grid.GetHexById("A5"), "B");
//
//     dots["A1"].connections.push(grid.GetHexById("B2"));
//     dots["A1"].connections.push(grid.GetHexById("D2"));
//     dots["A5"].connections.push(grid.GetHexById("B4"));
//     dots["A5"].connections.push(grid.GetHexById("C5"));
//     dots["A5"].connections.push(grid.GetHexById("D4"));
//     dots["A5"].connections.push(grid.GetHexById("E5"));
//     dots["A5"].connections.push(grid.GetHexById("D6"));
//     dots["A5"].connections.push(grid.GetHexById("B6"));
//     dots["A5"].connections.push(grid.GetHexById("A5"));


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
            //
            // canvas.removeEventListener("click", LC.onClick);
            //
            // canvas.addEventListener("click", LP.onClick);
            // canvas.addEventListener("mousemove", LP.onMouseMove);
        } else {
            button.value = "Play";
            //
            // canvas.addEventListener("click", LC.onClick);
            //
            // canvas.removeEventListener("click", LP.onClick);
            // canvas.removeEventListener("mousemove", LP.onMouseMove);
        }
    }

    let button = <HTMLButtonElement>document.getElementById("toggleButton");
    button.addEventListener("click", switchMode, false);

    let LC = new LevelCreator(grid, dots, FlowDot.COLORS);

    LC.start(canvas, drawThings);

    drawThings(drawer);
}

main();

import * as HT from "HexagonToolTs";
import * as HG from "HexagonGridTs";
import {FlowDot} from "./FlowDot";

export class LevelCreator {
    private grid: HG.BaseHexGrid;
    private dots: {[index: string]: FlowDot};

    private labelStack: string[];

    public constructor(grid: HG.BaseHexGrid, dots: {[index: string]: FlowDot}, colors: {[index: string]: string}) {
        this.grid = grid;
        this.dots = dots;
        for (let label in colors) {
            this.labelStack.push(label);
            this.labelStack.push(label);
        }
        this.labelStack.sort().reverse();
    }

    public start(canvas: HTMLCanvasElement) {
        canvas.addEventListener("click", this.onClick, false);
    }

    public stop(canvas: HTMLCanvasElement) {
        canvas.removeEventListener("click", this.onClick, false);
    }

    private onClick(event: HTMLElementEventMap["click"]) {
        let mousePoint = new HT.Point(event.pageX, event.pageY);
        let hex = this.grid.getHexAt(mousePoint);
        if(!hex) return;
        console.log(this.labelStack);
        if(!this.dots[hex.ID]) {  // if the hex is currently empty
            let nextLabel = this.labelStack.pop();
            if(nextLabel == undefined) return;
            this.dots[hex.ID] = new FlowDot(hex, nextLabel);
        } else {
            this.labelStack.push(this.dots[hex.ID].label);
            delete this.dots[hex.ID];
        }
    }
}

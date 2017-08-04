import * as HT from "HexagonToolTs";
import * as HG from "HexagonGridTs";
import {FlowDot} from "./FlowDot";

export class LevelCreator {
    private grid: HG.BaseHexGrid;
    private dots: { [index: string]: FlowDot };

    private labelStack: string[] = [];

    private canvas: HTMLCanvasElement | null = null;
    private draw: ((drawer: CanvasRenderingContext2D) => void) | null = null;

    public constructor(grid: HG.BaseHexGrid, dots: { [index: string]: FlowDot }, colors: { [index: string]: string }) {
        this.grid = grid;
        this.dots = dots;
        for (let label in colors) {
            this.labelStack.push(label);
            this.labelStack.push(label);
        }
        this.labelStack.sort().reverse();
    }

    public start(canvas: HTMLCanvasElement, draw: (drawer: CanvasRenderingContext2D) => void) {
        this.canvas = canvas;
        this.draw = draw;
        canvas.addEventListener("click", this.onClick.bind(this), false);
    }

    public stop(canvas: HTMLCanvasElement) {
        this.canvas = null;
        this.draw = null;
        canvas.removeEventListener("click", this.onClick.bind(this), false);
    }

    private onClick(event: HTMLElementEventMap["click"]) {
        if (!this.canvas) return;
        let drawer = this.canvas.getContext("2d");
        if (!drawer || !this.draw) return;

        let mousePoint = new HT.Point(event.pageX, event.pageY);
        let hex = this.grid.getHexAt(mousePoint);
        if (!hex) return;
        console.log(hex.ID);
        if (!this.dots[hex.ID]) {  // if the hex is currently empty
            let nextLabel = this.labelStack.pop();
            if (nextLabel == undefined) return;
            this.dots[hex.ID] = new FlowDot(hex, nextLabel);
        } else {
            this.labelStack.push(this.dots[hex.ID].label);
            delete this.dots[hex.ID];
        }

        this.draw(drawer);
    }
}

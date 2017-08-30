import * as HT from "HexagonTool";
import {FlowDot} from "./FlowDot";
import {Data} from "./Data";

export class LevelCreator {
    private data: Data;

    private labelStack: string[];

    public constructor(data: Data) {
        console.log("constructing LevelCreator");
        this.data = data;
        this.labelStack = [];
        for (let label in FlowDot.COLORS) {
            this.labelStack.push(label);
            this.labelStack.push(label);
        }
        this.labelStack.sort().reverse();
    }

    public start() {
        console.log("starting LC listener");
        this.data.canvas.addEventListener("click", this.onClickBound, false);
    }

    public stop() {
        console.log("stopping LC listener");
        this.data.canvas.removeEventListener("click", this.onClickBound, false);
    }

    private onClickBound = this.onClick.bind(this);

    private onClick(event: HTMLElementEventMap["click"]) {
        console.log("levelCreator Click");
        let mousePoint = new HT.Point(event.pageX, event.pageY);
        let hex = this.data.grid.getHexAt(mousePoint);
        if (!hex) return;
        // console.log(this.labelStack);
        if (!this.data.dots[hex.ID]) {  // if the hex is currently empty
            let nextLabel = this.labelStack.pop();
            if (nextLabel == undefined) return;
            this.data.dots[hex.ID] = new FlowDot(hex, nextLabel);
        } else {
            this.labelStack.push(this.data.dots[hex.ID].label);
            delete this.data.dots[hex.ID];
        }

        this.data.updateCanvas();
    }
}

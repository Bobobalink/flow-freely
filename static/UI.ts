import {FlowGridNormal} from "./HexagonGrid";
import {Data} from "./Data";
import {LevelCreator} from "./levelCreator";

export class UI {
    private modeSwitchButton: HTMLButtonElement;
    private sizeSlider: HTMLInputElement;

    private lastBoardSize = 0;

    private data: Data;

    public constructor(data: Data) {
        let tmp = document.getElementById("toggleButton");
        if(!tmp) throw new Error();
        this.modeSwitchButton = <HTMLButtonElement>tmp;
        tmp = document.getElementById("boardSize");
        if(!tmp) throw new Error();
        this.sizeSlider = <HTMLInputElement>tmp;
        this.lastBoardSize = parseInt(this.sizeSlider.value);
        this.data = data;

        this.modeSwitchButton.addEventListener("click", this.boundOnModeSwitch);
        this.sizeSlider.addEventListener("mousemove", this.boundOnSliderChange);

        this.data.levelCreator.start();  // start by creating the level
    }

    private boundOnModeSwitch = this.onModeSwitchButtonPress.bind(this);

    private onModeSwitchButtonPress(event: HTMLElementEventMap['click']) {
        if (this.modeSwitchButton.value == "Play") {
            this.modeSwitchButton.value = "Edit";

            this.data.levelCreator.stop();
            this.data.levelPlayer.start();
        } else {
            this.modeSwitchButton.value = "Play";

            this.data.levelPlayer.stop();
            this.data.levelCreator.start();

        }
    }

    private boundOnSliderChange = this.onSliderChange.bind(this);


    // is this really this hard?
    private onSliderChange(event: HTMLElementEventMap['mousemove']) {
        let newVal = parseInt(this.sizeSlider.value);
        if(this.lastBoardSize == newVal) return;
        this.lastBoardSize = newVal;
        this.data.levelCreator.stop();  // removes old bindings
        this.data.levelPlayer.stop();  // removes old bindings
        this.data.dots = {};
        this.data.grid = new FlowGridNormal(this.data.canvas.width * 0.95, this.data.canvas.height * 0.95, newVal);
        this.data.UI = new UI(this.data);  // makes new bindings
        this.data.levelCreator = new LevelCreator(this.data);  // replaces labelStack


        this.data.updateCanvas();
    }
}

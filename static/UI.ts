import {FlowGridNormal} from "./HexagonGrid";
import {Data} from "./Data";
import {LevelCreator} from "./levelCreator";

export class UI {
    sizeChanged: boolean;
    private modeSwitchButton: HTMLButtonElement;
    private sizeSlider: HTMLInputElement;
    private sizeDisplay: HTMLDivElement;

    private lastBoardSize = 0;

    private data: Data;

    public constructor(data: Data) {
        let tmp = document.getElementById("toggleButton");
        if (!tmp) throw new Error();
        this.modeSwitchButton = <HTMLButtonElement>tmp;
        tmp = document.getElementById("boardSize");
        if (!tmp) throw new Error();
        this.sizeSlider = <HTMLInputElement>tmp;
        tmp = document.getElementById("boardSizeDisplay");
        if(!tmp) throw new Error();
        this.sizeDisplay = <HTMLDivElement>tmp;
        this.lastBoardSize = parseInt(this.sizeSlider.value);
        this.data = data;

        this.data.levelCreator.start();  // starting click behavior should be level creation
    }

    public start() {
        this.modeSwitchButton.addEventListener("click", this.boundOnModeSwitch);

        this.sizeSlider.addEventListener("mousedown", this.boundOnSliderMouseDown);
        this.sizeSlider.addEventListener("mouseup", this.boundOnSliderMouseUp);
        this.sizeSlider.addEventListener("mousemove", this.boundOnSliderChange);
    }

    public stop() {
        this.modeSwitchButton.removeEventListener("click", this.boundOnModeSwitch);

        this.sizeSlider.removeEventListener("mousedown", this.boundOnSliderMouseDown);
        this.sizeSlider.removeEventListener("mouseup", this.boundOnSliderMouseUp);
        this.sizeSlider.removeEventListener("mousemove", this.boundOnSliderChange);
    }

    private boundOnModeSwitch = this.onModeSwitchButtonPress.bind(this);

    private onModeSwitchButtonPress(event: HTMLElementEventMap['click'] | null) {
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

    // is this really this hard?
    private boundOnSliderMouseDown = this.onSliderMouseDown.bind(this);

    private onSliderMouseDown(event: HTMLElementEventMap['mousedown']) {
        this.data.levelPlayer.stop();  // stop events while the user is threatening to change the board size
        this.data.levelCreator.stop();
    }

    private boundOnSliderChange = this.onSliderChange.bind(this);

    private onSliderChange(event: HTMLElementEventMap['mousemove']) {
        let newVal = parseInt(this.sizeSlider.value);
        if (this.lastBoardSize == newVal) return;
        this.lastBoardSize = newVal;
        this.sizeChanged = true;

        this.sizeDisplay.innerHTML = newVal.toString();

        this.data.dots = {};
        this.data.grid = new FlowGridNormal(this.data.canvas.width * 0.95, this.data.canvas.height * 0.95, newVal);

        this.data.updateCanvas();
    }

    private boundOnSliderMouseUp = this.onSliderMouseUp.bind(this);

    private onSliderMouseUp(event: HTMLElementEventMap['mouseup']) {
        if (this.sizeChanged) {
            this.data.levelCreator = new LevelCreator(this.data);  // replaces labelStack
            this.modeSwitchButton.value = "Play";  // resets button
            this.data.UI.stop();
            this.data.UI = new UI(this.data);  // makes new bindings
            this.data.UI.start();
        } else {  // switch mode twice to return to normal operation (hopefully)
            this.onModeSwitchButtonPress(null);
            this.onModeSwitchButtonPress(null);
        }
    }
}

import {Data} from "./Data";

let data: Data;

function main() {
    data = new Data();
    data.updateCanvas();

    data.UI.start();
}

main();

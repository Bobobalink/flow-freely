import * as HT from "./HexagonToolTs";

export class BaseHexGrid {
    public static letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    public hexes: HT.Hexagon[] = [];
    public hexByIndex: { [index: number]: HT.Hexagon[] } = {};

    public constructor(width: number, height: number, prototype: HT.Hexagon) {
        let row: number = 0;
        let y: number = 0.0;
        while (y + prototype.height <= height) {
            let col = 0;
            let offset = 0.0;

            if (row % 2 == 1) {
                if (prototype.skew) {
                    offset = prototype.width / 2;
                } else {
                    offset = (prototype.width - prototype.side) / 2 + prototype.side;
                }
                col = 1;
            }

            let x = offset;
            while (x + prototype.width <= width) {
                let hexId = this.getHexId(row, col);
                let h = HT.Hexagon.fromPrototype(prototype, hexId, new HT.Point(x, y));

                let pathCoord = col;
                if (prototype.skew) {
                    h.pathCoordY = row;
                    pathCoord = row;
                } else {
                    h.pathCoordX = col;
                }

                this.hexes.push(h);

                if(!this.hexByIndex[pathCoord])
                    this.hexByIndex[pathCoord] = [];
                this.hexByIndex[pathCoord].push(h);

                col += 2;
                if (prototype.skew) {
                    x += prototype.width;
                } else {
                    x += prototype.width + prototype.side;
                }
            }
            row++;
            if (prototype.skew) {
                y += (prototype.height - prototype.side) / 2 + prototype.side;
            } else {
                y += prototype.height / 2;
            }
        }

        for (let coord1 in this.hexByIndex) {
            let hexesAtInd = this.hexByIndex[coord1];
            let coord2 = Math.floor(parseFloat(coord1) / 2) + (parseFloat(coord1) % 2);
            for (let h of hexesAtInd) {
                if (prototype.skew) {
                    h.pathCoordX = coord2++;
                } else {
                    h.pathCoordY = coord2++;
                }
            }
        }
    }

    // a, b, c ... x, y, z, aa, ab, ac ... zx, zy, zz, aaa, aab
    private getHexId(row: number, col: number): string {
        let letterIndex = row;
        let prefix = "";
        if (letterIndex >= 26) {
            prefix = this.getHexId(Math.floor(letterIndex / 26 - 1), col);
        }
        return prefix + BaseHexGrid.letters[row] + col;
    }

    public getHexAt(p: HT.Point): HT.Hexagon | null {
        for (let h of this.hexes) {
            if (h.contains(p)) {
                return h;
            }
        }
        return null;
    }

    public gridDistBetween(h1: HT.Hexagon, h2: HT.Hexagon): number {
        let dx = h1.pathCoordX - h2.pathCoordX;
        let dy = h1.pathCoordY - h2.pathCoordY;
        return ((Math.abs(dx) + Math.abs(dy) + Math.abs(dx - dy)) / 2);
    }

    public getHexById(id: string): HT.Hexagon | null {
        for (let h of this.hexes) {
            if (h.ID == id)
                return h;
        }
        return null;
    }
}

export class FlowGridNormal extends BaseHexGrid {
    public constructor(pixelWidth: number, pixelHeight: number, size: number) {
        let hexHeight: number = 0;
        let hexWidth: number = 0;
        let hexSide: number = 0;

        let heightIsLimit: boolean = pixelWidth * HT.Hexagon.equilRatio > pixelHeight * 3 / 4;
        if (heightIsLimit) {
            console.log("heightislimit");
            hexHeight = pixelHeight / (size + 1);
            hexWidth = hexHeight / HT.Hexagon.equilRatio;
            hexSide = hexWidth / 2;
        } else {
            console.log("widthislimit");
            hexWidth = pixelWidth / ((size + 1) * 3 / 4);  // hexes overlap laterally by 1/4 of their width
            hexHeight = hexWidth * HT.Hexagon.equilRatio;
            hexSide = hexWidth / 2;
        }

        let protoHex = new HT.Hexagon("", 0, 0, false, hexSide, hexWidth, hexHeight);

        super(hexWidth * (size + 1) * 3 / 4 + 1, hexHeight * (size + 1) + 1, protoHex);  // use sizes computed this way to avoid having extra hexes

        let lastIndex = this.hexes[this.hexes.length - 1].ID.split(/\d+/i)[0];
        for (let h in this.hexes) {
            if (this.hexes[h].ID.match(/A\d+/i) || this.hexes[h].ID.match(lastIndex + '\\d+')) {  // prune the ones that stick out... TODO: this is probably stupid
                delete this.hexes[h];
            }
        }

        // because I've 1000% given up on performance, O(n) fixing of the fact that I can't figure out how to make typescript use a set
        let newList: HT.Hexagon[] = [];
        for (let item of this.hexes) {
            if (item)
                newList.push(item);
        }
        this.hexes = newList;
    }
}

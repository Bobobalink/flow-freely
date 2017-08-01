export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distance(p: Point): number {
        return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
    }
}

export class Rectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getCorners(): Point[] {
        let out: Point[] = [];
        out.push(new Point(this.x, this.y));
        out.push(new Point(this.x, this.y + this.height));
        out.push(new Point(this.x + this.width, this.y));
        out.push(new Point(this.x + this.width, this.y + this.height));
        return out;
    }
}

export class Line {
    public x1: number;
    public x2: number;
    public y1: number;
    public y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

export class Hexagon {
    public points: Point[];
    public ID: string;
    public pathCoordX: number;
    public pathCoordY: number;
    public x;
    public y;
    public x1;
    public y1;
    public p1: Point;
    public topLeft: Point;
    public bottomRight: Point;
    public midPoint: Point;
    public height: number;
    public width: number;
    public side: number;
    public skew: boolean;

    public lineColor: string = "black";
    public lineWidth: number = 1.0;
    public drawExtras: boolean = false;

    constructor(id: string, x: number, y: number, skew: boolean = false, side: number = 50, width: number = 100, height: number = 86.60254037844388) {
        this.height = height;
        this.width = width;
        this.side = side;
        this.points = [];
        this.x = x;
        this.y = y;
        this.skew = skew;
        if (!skew) {
            this.x1 = (width - side) / 2;
            this.y1 = (height / 2);
            this.points.push(new Point(this.x1 + x, y));
            this.points.push(new Point(this.x1 + side + x, y));
            this.points.push(new Point(width + x, this.y1 + y));
            this.points.push(new Point(this.x1 + side + x, height + y));
            this.points.push(new Point(this.x1 + x, height + y));
            this.points.push(new Point(x, this.y1 + y));
        } else {
            this.x1 = (width / 2);
            this.y1 = (height - side) / 2;
            this.points.push(new Point(this.x1 + x, y));
            this.points.push(new Point(width + x, this.y1 + y));
            this.points.push(new Point(width + x, this.y1 + side + y));
            this.points.push(new Point(this.x1 + x, height + y));
            this.points.push(new Point(x, this.y1 + side + y));
            this.points.push(new Point(x, this.y1 + y));
        }

        this.ID = id;
        this.topLeft = new Point(this.x, this.y);
        this.bottomRight = new Point(this.x + width, this.y + height);
        this.midPoint = new Point(this.x + (width / 2), this.y + (height / 2));
        this.p1 = new Point(x + this.x1, y + this.y1);
    }

    draw(drawContext: CanvasRenderingContext2D) {
        drawContext.strokeStyle = this.lineColor;
        drawContext.lineWidth = this.lineWidth;
        drawContext.beginPath();
        drawContext.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            drawContext.lineTo(this.points[i].x, this.points[i].y);
        }
        drawContext.closePath();
        drawContext.stroke();

        if (this.drawExtras) {
            //draw text for debugging
            drawContext.fillStyle = this.lineColor;
            drawContext.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            drawContext.textAlign = "center";
            drawContext.textBaseline = 'middle';
            //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            drawContext.fillText(this.ID, this.midPoint.x, this.midPoint.y);

            //draw co-ordinates for debugging
            drawContext.fillStyle = "black";
            drawContext.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            drawContext.textAlign = "center";
            drawContext.textBaseline = 'middle';
            //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            drawContext.fillText("(" + this.pathCoordX + "," + this.pathCoordY + ")", this.midPoint.x, this.midPoint.y + 10);

        }
    }

    public isInBounds(x: number, y: number): boolean {
        return this.contains(new Point(x, y));
    }

    private isInRectangularBounds(p: Point): boolean {  // rectangular bounding box check (pre-check)
        return this.topLeft.x < p.x && this.topLeft.y < p.y && p.x < this.bottomRight.x && p.y < this.bottomRight.y;

    }

    public contains(p: Point): boolean { // actual real bounding check
        let isIn = false;
        if (this.isInRectangularBounds(p)) {
            let i, j = 0;
            for (i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
                let iP = this.points[i];
                let jP = this.points[j];
                if (
                    (
                        ((iP.y <= p.y) && (p.y < jP.y)) ||
                        ((jP.y <= p.y) && (p.y < iP.y))
                    ) &&
                    (p.x < (jP.x - iP.x) * (p.y - iP.y) / (jP.y - iP.y) + iP.x)
                ) {
                    isIn = !isIn;
                }
            }
        }
        return isIn;
    }

    static equilRatio = 0.8660254037844388;

    static makeRegularHexagon(size: number, location: Point, id, skew: boolean = false): Hexagon {
        return new Hexagon(id, location.x, location.y, skew, size / 2, size, size * 0.860254037844388);
    }

    static fromPrototype(protoype: Hexagon, id, location: Point = null, skew: boolean = null, side: number = null, width: number = null, height: number = null) {
        let xO = location == null ? protoype.x : location.x;
        let yO = location == null ? protoype.y : location.y;
        let skewO = skew == null ? protoype.skew : skew;
        let sideO = side == null ? protoype.side : side;
        let widthO = width == null ? protoype.width : width;
        let heightO = height == null ? protoype.height : height;
        return new Hexagon(id, xO, yO, skewO, sideO, widthO, heightO);
    }
}
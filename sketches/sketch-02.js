const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1080, 1080],
    pixelsPerInch: 300,
    animate: true
};

// let colors = ["#183a1d", "#fefbe9  ", "#f6c453  ", "#f0a04b   ", "#e1eedd"];
// let colors = ["#030e12", "#fcde67   ", "#5bccf6   "];
// let colors = ["#141850", "#303179   ", "#ed7966    ", "#f5cac2 ", "#fae5df ", "#1d1d1d"];
// let colors = ["#4D455D", "#F5E9CF   ", "#E96479    ", "#7DB9B6 ", "#1d1d1d"];
let colors = ["#4D455D", "#F5E9CF   ", "#E96479    ", "#7DB9B6 ", "#1d1d1d"];
// let colors = ["#d7e1ee", "#cbd6e4", "#bfcbdb", "#b3bfd1", "#a4a2a8", "#df8879", "#c86558", "#b04238", "#991f17"];
// let colors = ["#1984c5", "#22a7f0", "#63bff0", "#a7d5ed", "#e2e2e2", "#e1a692", "#de6e56", "#e14b31", "#c23728"];
// let colors = ["#54bebe", "#76c8c8", "#98d1d1", "#badbdb", "#dedad2", "#e4bcad", "#df979e", "#d7658b", "#c80064"];
// let colors = ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"];
// let colors = ["#99B898", "#FECEAB", "#FF847C", "#E84A5F", "#2A363B"];
// let colors = ["#A8A7A7   ", "#CC527A   ", "#E8175D   ", "#474747   ", "#363636 "];
// let colors = ["#E1F5C4      ", "#EDE574      ", "#F9D423      ", "#FC913A      ", "#FF4E50 "];
// let colors = ["#E5FCC2", "#9DE0AD", "#45ADA8", "#547980", "#594F4F"];
let currentColors = [];
let backgroundNumber;
let lineNumber;

const setupColors = () => {
    backgroundNumber = Math.floor(random.range(0, colors.length));
    for (let i = 0; i < colors.length; i++) {
        if (i == backgroundNumber) continue;
        currentColors.push(colors[i]);
    }
}
setupColors();
const randCol = () => {
    let rand = Math.floor(random.range(0, currentColors.length));
    return currentColors[rand];
}


// const degToRad = (degrees) => {
//     return degrees / 180 * Math.PI;
// };
const sketch = ({context, width, height}) => {
    const curvyPieces = [];
    const linePieces = [];

    const w = width * 0.005;
    const h = height * 0.1;
    let x, y;

    //'c' for Center of Circle
    let cx = width * 0.5;
    let cy = height * 0.5;
    // cx = 0;
    // cy = 0;
    const iterations = 60;
    let radius = width * 0.3;

    for (let i = 0; i < iterations; i++) {
        const slice = math.degToRad(360 / iterations);
        const angle = slice * i;

        radius = random.range(width * 0.05, width * 0.75);
        x = cx + radius * Math.sin(-angle);
        y = cy + radius * Math.cos(angle);

        linePieces.push(new LinePiece(x, y, angle, w, h, cx, cy));
        curvyPieces.push(new CurvyPiece(cx, cy, radius, slice, iterations, angle));
    }

    return ({context, width, height}) => {
        context.save();
        context.fillStyle = colors[backgroundNumber];
        context.fillRect(0, 0, width, height);
        context.restore();

        curvyPieces.forEach(curvyPiece => {
            curvyPiece.update();
            curvyPiece.draw(context);
        });

        linePieces.forEach(linePiece => {
            linePiece.update(cx, cy, width, height);
            linePiece.draw(context);
        });

    };
};

canvasSketch(sketch, settings);

class LinePiece {
    constructor(x, y, angle, w, h, cx, cy) {
        this.pos = new Vector(x, y);
        this.angle = angle;
        this.w = w;
        this.h = h;

        //X: How thick. Y: How long
        this.scale = new Vector(random.gaussian(.2, .1) + 0.05, random.range(.05, 7));
        this.height = h * random.range(0, 0.01) * 1000;
        this.direction = this.pos.getDirection(cx, cy, this.pos.x, this.pos.y);
        this.startingPosition = new Vector(this.pos.x, this.pos.y);

        this.color = randCol();
        this.asdf = 0;
    }
    
    isOffScreen(width, height) {
        if (this.pos.x >= width || this.pos.y >= height || this.pos.x <= 0 || this.pos.y <= 0) {
            return true;
        }
    }

    beginAnew(cx, cy, width) {

        //new color
        this.color = randCol();

        //new length
        let radius = random.range(width * 0.05, width * 0.75);
        let x = cx + radius * Math.sin(-this.angle);
        let y = cy + radius * Math.cos(this.angle);
        
        //new starting position
        this.pos.x = x;
        this.pos.y = y;

        //this.angle = math.degToRad(random.range(0,360));
    }

    update(cx, cy, width, height) {
        let speed = -3.2;
        this.pos.x = this.pos.x - this.direction.x * speed;
        this.pos.y = this.pos.y - this.direction.y * speed;

        if (this.isOffScreen(width, height)) {
            this.beginAnew(cx, cy, width);
        }
    }

    draw(context) {

        //Straight Lines
        //////////////////////////
        context.save();
        context.beginPath();
        // context.fillStyle = this.color;
        // context.translate(this.pos.x, this.pos.y);
        // context.rotate(this.angle);
        // context.scale(this.scale.x, this.scale.y);
        // context.rect(this.w, this.height, this.w, this.h);

        context.lineWidth = this.scale.x * 10;
        context.strokeStyle = this.color;
        // lineAtAngle(this.pos.x, this.pos.y, this.asdf, this.angle + math.degToRad(90), context);
        lineAtAngle(this.pos.x, this.pos.y, this.height, this.angle + math.degToRad(90), context);
        //console.log(this.pos.getDirectionFromAngle(this.angle));
        context.stroke();
        context.fill();
        context.restore();
        ////////////////////////

        this.asdf += 2;
    }
}

//If you just want to draw a line at a certain angle you can do the following instead:
function lineAtAngle(x1, y1, length, angle, ctx) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + length * Math.cos(angle), y1 + length * Math.sin(angle));
}

class CurvyPiece {
    constructor(x, y, radius, slice, iterations, angle) {
        this.pos = new Vector(x, y);
        this.radius = radius * random.range(0, 2);

        // this.rotateSpeed = random.range(-0.05, 0.05);
        this.rotateSpeed = random.gaussian(0, 0.025);

        this.color = randCol();
        this.lineWidth = random.gaussian(1, 10) + (this.radius * .0025);
        this.angle = angle;
        this.startAngle = slice * random.range(0, iterations * 0.5);
        this.endAngle = slice * random.range(iterations * .3, iterations * .9);
    }

    update() {
        this.radius += 1.005;
        if (this.radius > 1080) {
            this.radius = 0.1;
        }

        this.startAngle += this.rotateSpeed;
        this.endAngle += this.rotateSpeed;
    }

    draw(context) {
        //Arcs
        context.save(); ////////////////////////////
        context.beginPath();
        context.strokeStyle = this.color;
        context.translate(this.pos.x, this.pos.y);
        context.rotate(this.angle);

        context.lineWidth = this.lineWidth;

        context.beginPath();
        context.arc(0, 0, this.radius, this.startAngle, this.endAngle);
        context.stroke();
        context.restore(); ////////////////////////////
    }
}


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getDirection(x1, y1, x2, y2) {

        let direction = new Vector(x2 - x1, y2 - y1);
        let length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        let x = direction.x / length; //assigning new value to x (dividing x by length of the vector)
        let y = direction.y / length; //assigning new value to y
        return new Vector(x, y);
    }

    normalize() {
        let length = Math.sqrt(this.x * this.x + this.y * this.y); //calculating length
        let x = this.x / length; //assigning new value to x (dividing x by length of the vector)
        let y = this.y / length; //assigning new value to y
        return new Vector(x, y);
    }

    getDistance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    getPointAtLength(x, y, angle, length) {
        let x2 = length * sin(angle) + x;
        let y2 = length * cos(angle) + y;
        return new Vector(x2, y2)
    }

    getDirectionFromAngle(angle) {
        let x2 = Math.sin(angle);
        let y2 = Math.cos(angle);
        return new Vector(x2, y2)
    }
}

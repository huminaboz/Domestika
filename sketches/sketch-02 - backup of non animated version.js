const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1080, 1080],
    pixelsPerInch: 300,
    animate: false
};

// let colors = ["#183a1d", "#fefbe9  ", "#f6c453  ", "#f0a04b   ", "#e1eedd"];
// let colors = ["#030e12", "#fcde67   ", "#5bccf6   "];
let colors = ["#141850", "#303179   ", "#ed7966    ", "#f5cac2 ", "#fae5df ", "#1d1d1d"];
// let colors = ["#4D455D", "#F5E9CF   ", "#E96479    ", "#7DB9B6 ", "#1d1d1d"];
// let colors = ["#4D455D", "#F5E9CF   ", "#E96479    ", "#7DB9B6 ", "#1d1d1d"];
//let colors = ["#d7e1ee", "#cbd6e4", "#bfcbdb", "#b3bfd1", "#a4a2a8", "#df8879", "#c86558", "#b04238", "#991f17"];
// let colors = ["#2e2b28", "#3b3734", "#474440", "#54504c", "#6b506b", "#ab3da9", "#de25da", "#eb44e8", "#ff80ff"];
// let colors = ["#1984c5", "#22a7f0", "#63bff0", "#a7d5ed", "#e2e2e2", "#e1a692", "#de6e56", "#e14b31", "#c23728"];
// let colors = ["#54bebe", "#76c8c8", "#98d1d1", "#badbdb", "#dedad2", "#e4bcad", "#df979e", "#d7658b", "#c80064"];
// let colors = ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"];
//let colors = ["#99B898", "#FECEAB", "#FF847C", "#E84A5F", "#2A363B"];
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
const sketch = () => {
    //let asdf = 0;
    
    return ({context, width, height}) => {
        context.save();
        // context.fillStyle = colors[0];
        context.fillStyle = colors[backgroundNumber];
        context.fillRect(0, 0, width, height);
        context.restore();

        //'c' for Center of Circle
        const w = width * 0.005;
        const h = height * 0.1;
        let x, y;

        let cx = width * 0.5;
        let cy = height * 0.5;
        // let cx = 0;
        // let cy = 0;
        const iterations = 60;
        let radius = width * 0.3;

        for (let i = 0; i < iterations; i++) {
            const slice = math.degToRad(360 / iterations);
            const angle = slice * i;

            radius = random.range(width * 0.05, width * 0.75)
            x = cx + radius * Math.sin(-angle);
            y = cy + radius * Math.cos(angle);


            //Straight Lines
            //////////////////////////
            context.save();
            context.beginPath();
            context.fillStyle = randCol();
            context.translate(x, y);
            context.rotate(angle);

            context.scale(random.gaussian(.2, .1) + 0.05, random.range(.05, 7));
            context.rect(w, h * random.range(0, 0.01), w, h);

            context.fill();
            context.restore();
            ////////////////////////

            //Arcs
            context.save(); ////////////////////////////
            radius = width * 0.3;
            context.beginPath();
            context.strokeStyle = randCol();
            context.translate(cx, cy);
            context.rotate(angle);

            context.lineWidth = random.gaussian(1, 10);

            context.beginPath();
            context.arc(0, 0, radius * random.range(0, 2), slice * random.range(0, iterations), slice * random.range(iterations * .2, iterations * 2));
            context.stroke();
            context.restore(); ////////////////////////////
        }
//asdf+= 0.000001;

    };
};

canvasSketch(sketch, settings);

class CurvyPiece
{
    constructor()
    {
        
    }
    
    draw(context)
    {
        
    }
}

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

const randCol = () => {
    let rand = Math.floor(random.range(0, colors.length));
    console.log(rand);
    return colors[rand];
}


// const degToRad = (degrees) => {
//     return degrees / 180 * Math.PI;
// };

const sketch = () => {
    return ({context, width, height}) => {
        context.save();
        // context.fillStyle = colors[0];
        context.fillStyle = randCol();
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
        const iterations = 100;
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


    };
};

canvasSketch(sketch, settings);

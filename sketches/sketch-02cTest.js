const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require("canvas-sketch-util/random");

const settings = {
    dimensions: [1080, 1080],
    animate: true
};

const sketch = () => {
        let asdf = 0;
    return ({context, width, height}) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        let angle = math.degToRad(360 * asdf);
        asdf += .01;
        console.log(asdf)
        context.save(); ////////////////////////////
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.beginPath();
        const radius = 30;
        context.arc(width * 0.5, height * 0.5, radius, 0, 2 * Math.PI);
        lineAtAngle(width * 0.5, height * 0.5, asdf*radius, angle, context);
        context.stroke();
        context.restore(); ////////////////////////////
    };
};

canvasSketch(sketch, settings);

function lineAtAngle(x1, y1, length, angle, ctx) {
    ctx.save();
    ctx.fillStyle = "transparent";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + length * Math.cos(angle), y1 + length * Math.sin(angle));
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = "black";
    ctx.arc(x1 + length * Math.cos(angle), y1 + length * Math.sin(angle), 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}


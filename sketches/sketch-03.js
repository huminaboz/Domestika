const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colorUtils = require('canvas-sketch-util/color');

// let colors = ["#183a1d", "#fefbe9  ", "#f6c453  ", "#f0a04b   ", "#e1eedd"];
// let colors = ["#030e12", "#fcde67   ", "#5bccf6   "];
// let colors = ["#141850ff", "#303179ff", "#ed7966ff", "#f5cac2ff", "#fae5dfff", "#1d1d1dff"];
// let colors = ["#4D455D", "#F5E9CF   ", "#E96479    ", "#7DB9B6 ", "#1d1d1d"];
//let colors = ["#d7e1ee", "#cbd6e4", "#bfcbdb", "#b3bfd1", "#a4a2a8", "#df8879", "#c86558", "#b04238", "#991f17"];
// let colors = ["#2e2b28", "#3b3734", "#474440", "#54504c", "#6b506b", "#ab3da9", "#de25da", "#eb44e8", "#ff80ff"];
// let colors = ["#1984c5", "#22a7f0", "#63bff0", "#a7d5ed", "#e2e2e2", "#e1a692", "#de6e56", "#e14b31", "#c23728"];
// let colors = ["#54bebe", "#76c8c8", "#98d1d1", "#badbdb", "#dedad2", "#e4bcad", "#df979e", "#d7658b", "#c80064"];
// let colors = ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"];
let colors = ["#99B898", "#FECEAB", "#FF847C", "#E84A5F", "#2A363B"];
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
const randCol = () => {
    let rand = Math.floor(random.range(0, currentColors.length));
    return currentColors[rand];
}



const settings = {
    dimensions: [1080, 1080],
    animate: true
};

// const animate = () => {
//     console.log('asdf');
//     requestAnimationFrame(animate);
// }
// animate();


const averagePointSize = 30;
const sketch = ({context, width, height}) => {
    setupColors();
    lineNumber = Math.floor(random.range(0, currentColors.length));
    const agents = [];
    const iterations = 60;
    let maxLineWidth = averagePointSize * 0.4;

    for (let i = 0; i < iterations; i++) {
        const x = random.range(0, width);
        const y = random.range(0, height);


        // agents.push(new Agent(x, y, 
        //     Math.abs(random.gaussian(averagePointSize, averagePointSize * 0.2))));
        agents.push(new Agent(x, y, random.range(averagePointSize / 1.618, averagePointSize * 2)));
    }

    return ({context, width, height}) => {
        context.fillStyle = colors[backgroundNumber];
        context.fillRect(0, 0, width, height);

        for (let i = 0; i < agents.length; i++) {
            const agent = agents[i];
            for (let j = i + 1; j < agents.length; j++) {
                const other = agents[j];

                const dist = agent.pos.getDistance(other.pos);

                const maxDistance = 200;
                if (dist > maxDistance) continue;

                //context.lineWidth = 20;
                let distancePercent = math.mapRange(dist, 0, maxDistance, 0, 1);
                context.save();
                context.lineWidth = math.mapRange(dist, 0, maxDistance, maxLineWidth, 0);
                context.beginPath();
                context.moveTo(agent.pos.x, agent.pos.y);
                context.lineTo(other.pos.x, other.pos.y);
                // let newColor = colorUtils.blend(currentColors[lineNumber],
                //     colors[backgroundNumber],
                //     distancePercent);
                // context.strokeStyle = newColor.hex;
                context.strokeStyle = currentColors[lineNumber];
                context.stroke();
                context.restore();
            }
        }

        agents.forEach(agent => {
            agent.update();
            agent.draw(context);
            // agent.bounce(width, height);
            agent.wrap(width, height);
        });
    };
};

canvasSketch(sketch, settings);

class Vector {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
    }

    getDistance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}

const speed = 1;

class Agent {
    constructor(x, y, radius) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
        this.radius = radius;

        this.color = randCol();
        this.strokeColor = randCol();
        this.strokeWeight = random.range(0, averagePointSize);
    }

    bounce(width, height) {
        if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
        if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
    }

    wrap(width, height) {
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }

    update() {
        this.pos.x += this.vel.x * speed * 2;
        this.pos.y += this.vel.y * speed;
    }

    draw(context) {

        context.save();

        context.fillStyle = this.color;
        context.fillStyle = "rgba(255, 255, 255, 0)";
        context.strokeStyle = this.strokeColor;
        // context.lineWidth = Math.abs(this.pos.x)/20;
        //context.lineWidth = this.strokeWeight;
        context.translate(this.pos.x, this.pos.y);
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        //context.stroke();

        context.restore();
    }

}



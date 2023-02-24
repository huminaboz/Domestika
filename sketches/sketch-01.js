const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  pixelsPerInch: 300,
  animate: true
};



const sketch = () => {
  return ({ context, width, height }) => {

    let iterations;
    let radius = 50;

    if (width > height) {
      iterations = width / radius;
      radius = width * .05;
    } else {
      iterations = height / radius;
      radius = height * .05;
    }

    context.fillStyle = "#0053e1";
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#292929';
    context.strokeStyle = '#f4e3d1';
    let centerX = (width / 2);
    let centerY = (height / 2);
    context.fillRect(centerX - centerX / 2, 0, centerX, height);

    context.lineWidth = radius/20;
    for (let i = 0; i < iterations; i++) {
      for (let j = 0; j < iterations; j++) {
        if (Math.random() > .35) {
          context.beginPath();
          //context.arc(x,y,radius,startAngle,endAngle,counterclockwise);
          context.arc(centerX - (iterations / 2) * radius  + j * radius , centerY + i * radius - (iterations / 2) * radius, radius, 0, 2 * Math.PI);
          context.stroke();
        }

      }
    }
    
    
    //draw();

    // window.setInterval(draw, 500);
    
    
  };
};

canvasSketch(sketch, settings);


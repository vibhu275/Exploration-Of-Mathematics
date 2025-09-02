// This script animates two cars, each on a different graph, with a tangential line.
document.addEventListener('DOMContentLoaded', function() {

    // --- Setup for the first animation (Absolute Value function) ---
    const canvas1 = document.getElementById('absoluteValueAnimationCanvas');
    const ctx1 = canvas1.getContext('2d');
    let car1XPosition = -4; // Starting x-position
    const car1Speed = 0.02; // Speed of the car
    const playPauseBtn = document.getElementById('dualPlayPauseBtn');

    // The first function and its derivative
    function f1(x) {
        return 3 - Math.abs(x - 1);
    }
    function f1_prime(x) {
        // The derivative is a piecewise constant function
        if (x < 1) return 1;
        if (x > 1) return -1;
        return null; // Undefined at x = 1
    }

    // --- Setup for the second animation (Parabola function) ---
    const canvas2 = document.getElementById('parabolaAnimationCanvas');
    const ctx2 = canvas2.getContext('2d');
    let car2XPosition = -2; // Starting x-position
    const car2Speed = 0.02; // Speed of the car

    // The second function and its derivative
    function f2(x) {
        return -(x * x) + 2 * x + 2;
    }
    function f2_prime(x) {
        return -2 * x + 2;
    }

    let isPlaying = false;
    let animationFrameId1 = null;
    let animationFrameId2 = null;

    // Common graph properties
    const graphWidth = 10;
    const graphHeight = 8;
    let scaleX, scaleY, originX1, originY1, originX2, originY2;

    // Handles canvas resizing and recalculates all drawing parameters
    function resizeCanvases() {
        const container1 = canvas1.parentElement;
        canvas1.width = container1.clientWidth;
        canvas1.height = 400;
        
        const container2 = canvas2.parentElement;
        canvas2.width = container2.clientWidth;
        canvas2.height = 400;

        scaleX = canvas1.width / graphWidth;
        scaleY = canvas1.height / graphHeight;
        originX1 = canvas1.width / 2;
        originY1 = canvas1.height / 2;
        originX2 = canvas2.width / 2;
        originY2 = canvas2.height / 2 + 50;
        
        drawScenes();
    }

    // Draws the axes for a given context and origins
    function drawAxes(ctx, originX, originY) {
        ctx.save();
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(ctx.canvas.width, originY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, ctx.canvas.height);
        ctx.stroke();

        ctx.font = '12px Inter';
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('0', originX - 5, originY + 5);
        ctx.fillText('y', originX - 5, 10);
        ctx.fillText('x', ctx.canvas.width - 10, originY + 5);
        ctx.restore();
    }

    // Draws the graph of a function
    function drawFunction(ctx, f, originX, originY) {
        ctx.save();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let x_px = 0; x_px < ctx.canvas.width; x_px++) {
            const x = (x_px - originX) / scaleX;
            const y = f(x);
            const y_px = originY - y * scaleY;

            if (x_px === 0) {
                ctx.moveTo(x_px, y_px);
            } else {
                ctx.lineTo(x_px, y_px);
            }
        }
        ctx.stroke();
        ctx.restore();
    }
    
    // Draws a car at a specific position
    function drawCar(ctx, x, y, originX, originY) {
        ctx.save();
        const carX_px = originX + x * scaleX;
        const carY_px = originY - y * scaleY;
        
        const carBodyHeight = 15;
        const carBodyWidth = 30;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(carX_px - carBodyWidth / 2, carY_px - carBodyHeight, carBodyWidth, carBodyHeight, 5);
        ctx.fill();

        const wheelRadius = 5;
        const wheelY_px = carY_px + wheelRadius / 2;
        ctx.fillStyle = '#1f2937';
        
        ctx.beginPath();
        ctx.arc(carX_px - 10, wheelY_px, wheelRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(carX_px + 10, wheelY_px, wheelRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
    }

    // Draws the tangent line at the car's position
    function drawTangentLine(ctx, x, y, slope, originX, originY) {
        if (slope === null) {
            // Don't draw the tangent line if the derivative is undefined
            return;
        }

        ctx.save();
        ctx.strokeStyle = '#f59e0b'; // Amber-500
        ctx.lineWidth = 2;
        
        const carX_px = originX + x * scaleX;
        const carY_px = originY - y * scaleY;

        // Calculate a start and end point for the line
        const lineLength = 100;
        const dx = Math.cos(Math.atan(slope)) * lineLength;
        const dy = Math.sin(Math.atan(slope)) * lineLength;
        
        ctx.beginPath();
        ctx.moveTo(carX_px - dx, carY_px + dy);
        ctx.lineTo(carX_px + dx, carY_px - dy);
        ctx.stroke();
        ctx.restore();
    }

    // Main animation loops for both scenes
    function animate1() {
        if (!isPlaying) {
            cancelAnimationFrame(animationFrameId1);
            return;
        }
        car1XPosition += car1Speed;
        if (car1XPosition > 5) {
            car1XPosition = -4;
        }
        drawScene1();
        animationFrameId1 = requestAnimationFrame(animate1);
    }

    function animate2() {
        if (!isPlaying) {
            cancelAnimationFrame(animationFrameId2);
            return;
        }
        car2XPosition += car2Speed;
        if (car2XPosition > 4) {
            car2XPosition = -2;
        }
        drawScene2();
        animationFrameId2 = requestAnimationFrame(animate2);
    }
    
    // Draw functions for each canvas
    function drawScene1() {
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        drawAxes(ctx1, originX1, originY1);
        drawFunction(ctx1, f1, originX1, originY1);
        drawTangentLine(ctx1, car1XPosition, f1(car1XPosition), f1_prime(car1XPosition), originX1, originY1);
        drawCar(ctx1, car1XPosition, f1(car1XPosition), originX1, originY1);
    }
    
    function drawScene2() {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        drawAxes(ctx2, originX2, originY2);
        drawFunction(ctx2, f2, originX2, originY2);
        drawTangentLine(ctx2, car2XPosition, f2(car2XPosition), f2_prime(car2XPosition), originX2, originY2);
        drawCar(ctx2, car2XPosition, f2(car2XPosition), originX2, originY2);
    }
    
    function drawScenes() {
        drawScene1();
        drawScene2();
    }

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playPauseBtn.textContent = 'Pause All Animations';
            animate1();
            animate2();
        } else {
            playPauseBtn.textContent = 'Play All Animations';
            cancelAnimationFrame(animationFrameId1);
            cancelAnimationFrame(animationFrameId2);
        }
    });

    window.addEventListener('resize', resizeCanvases);
    window.addEventListener('load', () => {
        resizeCanvases();
        playPauseBtn.textContent = 'Play All Animations';
    });
});

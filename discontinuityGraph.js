// Get the canvas and its 2D rendering context
const discontinuityCanvas = document.getElementById('discontinuityGraphCanvas');
const discontinuityCtx = discontinuityCanvas.getContext('2d');
const controlButton = document.getElementById('controlButton');
const leftCoordsElement = document.getElementById('leftPointCoords');
const rightCoordsElement = document.getElementById('rightPointCoords');
    
let animationFrameId = null;
let t = 5; // Animation parameter. Starting further out to demonstrate a longer approach.
let isAnimating = false;

// Function to be graphed
function f(x) {
    return x !== 0 ? Math.sin(x) / x : 1;
}

// Function to draw an arrow on the canvas
function drawArrow(ctx, fromX, fromY, toX, toY, color) {
    // Draw the line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw the arrow head
    const headlen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

// Function to draw the entire graph
function drawDiscontinuityGraph() {
    // Clear the canvas
    discontinuityCtx.clearRect(0, 0, discontinuityCanvas.width, discontinuityCanvas.height);

    // Graph properties
    const width = discontinuityCanvas.width;
    const height = discontinuityCanvas.height;
    const originX = width / 2;
    const originY = height / 2;
    
    const scale = 120;
    const scaleX = scale; // pixels per unit on x-axis
    const scaleY = scale; // pixels per unit on y-axis
    
    // --- Draw the axes ---
    discontinuityCtx.beginPath();
    discontinuityCtx.strokeStyle = '#374151'; // gray-700
    discontinuityCtx.lineWidth = 1.5;
    discontinuityCtx.moveTo(0, originY);
    discontinuityCtx.lineTo(width, originY);
    discontinuityCtx.moveTo(originX, 0);
    discontinuityCtx.lineTo(originX, height);
    discontinuityCtx.stroke();

    // --- Draw the horizontal limit line at y = 1 ---
    discontinuityCtx.beginPath();
    discontinuityCtx.strokeStyle = '#9ca3af'; // gray-400
    discontinuityCtx.lineWidth = 1;
    discontinuityCtx.setLineDash([5, 5]); // dashed line
    const limitY = originY - 1 * scaleY;
    discontinuityCtx.moveTo(0, limitY);
    discontinuityCtx.lineTo(width, limitY);
    discontinuityCtx.stroke();
    discontinuityCtx.setLineDash([]);
    
    // Label for the horizontal limit line
    discontinuityCtx.font = '12px Inter, sans-serif';
    discontinuityCtx.fillStyle = '#9ca3af';
    discontinuityCtx.textAlign = 'right';
    discontinuityCtx.textBaseline = 'bottom';
    discontinuityCtx.fillText('y = 1', width - 10, limitY - 5);

    // --- Draw the function's graph ---
    discontinuityCtx.beginPath();
    discontinuityCtx.strokeStyle = '#2563eb'; // blue-600
    discontinuityCtx.lineWidth = 2.5;
    for (let i = 0; i < width; i++) {
        const x = (i - originX) / scaleX;
        const y = f(x);
        const canvasY = originY - y * scaleY;
        if (i === 0) {
            discontinuityCtx.moveTo(i, canvasY);
        } else {
            discontinuityCtx.lineTo(i, canvasY);
        }
    }
    discontinuityCtx.stroke();

    // --- Draw the hole at x = 0 ---
    discontinuityCtx.beginPath();
    discontinuityCtx.arc(originX, originY - 1 * scaleY, 5, 0, 2 * Math.PI);
    discontinuityCtx.fillStyle = '#f8fafc'; // Match background color of canvas
    discontinuityCtx.fill();
    discontinuityCtx.strokeStyle = '#2563eb';
    discontinuityCtx.lineWidth = 2;
    discontinuityCtx.stroke();

    // --- Add labels for axes and key points ---
    discontinuityCtx.font = '14px Inter, sans-serif';
    discontinuityCtx.fillStyle = '#1f2937';
    
    // Y-axis label
    discontinuityCtx.textAlign = 'right';
    discontinuityCtx.textBaseline = 'bottom';
    discontinuityCtx.fillText('y', originX - 5, 20);
    
    // X-axis label
    discontinuityCtx.textAlign = 'right';
    discontinuityCtx.textBaseline = 'top';
    discontinuityCtx.fillText('x', width - 10, originY + 5);
    
    // Origin label
    discontinuityCtx.textAlign = 'right';
    discontinuityCtx.textBaseline = 'top';
    discontinuityCtx.fillText('0', originX - 5, originY + 5);

    // --- Draw animated elements if active ---
    if (isAnimating) {
        // Left point and arrow
        const xLeft = -t;
        const yLeft = f(xLeft);
        const pxLeft = originX + xLeft * scaleX;
        const pyLeft = originY - yLeft * scaleY;

        // Draw the arrow pointing to the right
        const arrowLength = 20;
        drawArrow(discontinuityCtx, pxLeft - arrowLength, pyLeft, pxLeft, pyLeft, '#ef4444');
        
        // Draw the left point
        discontinuityCtx.beginPath();
        discontinuityCtx.arc(pxLeft, pyLeft, 6, 0, 2 * Math.PI);
        discontinuityCtx.fillStyle = '#ef4444'; // Red
        discontinuityCtx.fill();

        // Right point and arrow
        const xRight = t;
        const yRight = f(xRight);
        const pxRight = originX + xRight * scaleX;
        const pyRight = originY - yRight * scaleY;
        
        // Draw the arrow pointing to the left
        drawArrow(discontinuityCtx, pxRight + arrowLength, pyRight, pxRight, pyRight, '#3b82f6');
        
        // Draw the right point
        discontinuityCtx.beginPath();
        discontinuityCtx.arc(pxRight, pyRight, 6, 0, 2 * Math.PI);
        discontinuityCtx.fillStyle = '#3b82f6'; // Blue
        discontinuityCtx.fill();

        // Update coordinate text with 10 decimal places
        leftCoordsElement.textContent = `Left Point: (${xLeft.toFixed(10)}, ${yLeft.toFixed(10)})`;
        rightCoordsElement.textContent = `Right Point: (${xRight.toFixed(10)}, ${yRight.toFixed(10)})`;
    }
}

// Animation loop
function animate() {
    if (!isAnimating) {
        cancelAnimationFrame(animationFrameId);
        return;
    }
    
    // Decrease `t` to make the points approach x=0
    t *= 0.98;

    // Stop animation when t is very close to 0
    if (t < 0.0000000001) {
        isAnimating = false;
        controlButton.textContent = 'Reset Animation';
    }

    drawDiscontinuityGraph();
    animationFrameId = requestAnimationFrame(animate);
}

// Function to resize the canvas and redraw the graph
function resizeDiscontinuityCanvas() {
    discontinuityCanvas.width = discontinuityCanvas.offsetWidth;
    discontinuityCanvas.height = discontinuityCanvas.offsetHeight;
    drawDiscontinuityGraph();
}

// Event listener for the control button
controlButton.addEventListener('click', () => {
    if (isAnimating) {
        // Stop animation
        isAnimating = false;
        controlButton.textContent = 'Start Animation';
        cancelAnimationFrame(animationFrameId);
    } else {
        // Start animation or reset
        if (t < 0.0000000001) {
            t = 5; // Reset the starting point
            controlButton.textContent = 'Start Animation';
        }
        isAnimating = true;
        controlButton.textContent = 'Stop Animation';
        animate();
    }
});

// Event listener for window resizing
window.addEventListener('resize', resizeDiscontinuityCanvas);

// Initial draw and coordinate display
window.addEventListener('load', () => {
    resizeDiscontinuityCanvas();
    leftCoordsElement.textContent = `Left Point: (-${t.toFixed(10)}, ${f(-t).toFixed(10)})`;
    rightCoordsElement.textContent = `Right Point: (${t.toFixed(10)}, ${f(t).toFixed(10)})`;
});
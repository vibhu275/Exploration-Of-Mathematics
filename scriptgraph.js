// Get the canvas and its 2D rendering context
const staticCanvas = document.getElementById('staticGraphCanvas');
const staticCtx = staticCanvas.getContext('2d');

// Function to resize the canvas and redraw the graph
function resizeStaticCanvas() {
    staticCanvas.width = staticCanvas.offsetWidth;
    staticCanvas.height = staticCanvas.offsetHeight;
    drawStaticGraph();
}

// Draw the graph of f(x) = 1/(x-1)
function drawStaticGraph() {
    staticCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
    const width = staticCanvas.width;
    const height = staticCanvas.height;
    const originX = width / 2;
    const originY = height / 2;
    const scaleX = 80; // pixels per unit
    const scaleY = 80; // pixels per unit
    
    // The function to be graphed
    function f(x) {
        return 1 / (x - 1);
    }

    // Draw the axes
    staticCtx.beginPath();
    staticCtx.strokeStyle = '#64748b'; // slate-500
    staticCtx.lineWidth = 1;
    staticCtx.moveTo(0, originY);
    staticCtx.lineTo(width, originY);
    staticCtx.moveTo(originX, 0);
    staticCtx.lineTo(originX, height);
    staticCtx.stroke();

    // Draw the vertical asymptote at x=1
    staticCtx.beginPath();
    staticCtx.strokeStyle = '#ef4444'; // red-500
    staticCtx.lineWidth = 1.5;
    staticCtx.setLineDash([5, 5]);
    const asymptoteX = originX + 1 * scaleX;
    staticCtx.moveTo(asymptoteX, 0);
    staticCtx.lineTo(asymptoteX, height);
    staticCtx.stroke();
    staticCtx.setLineDash([]);
    
    // Asymptote label
    staticCtx.font = '12px Inter, sans-serif';
    staticCtx.fillStyle = '#ef4444';
    staticCtx.textAlign = 'center';
    staticCtx.textBaseline = 'bottom';
    staticCtx.fillText('x = 1', 306.18, 16.18);

    // Draw the function's graph
    staticCtx.beginPath();
    staticCtx.strokeStyle = '#2563eb'; // blue-600
    staticCtx.lineWidth = 2;
    for (let i = 0; i < width; i++) {
        const x = (i - originX) / scaleX;
        const y = f(x);
        const canvasY = originY - y * scaleY;
        if (Math.abs(x - 1) < 0.05) {
            staticCtx.stroke();
            staticCtx.beginPath();
        } else if (i === 0) {
            staticCtx.moveTo(i, canvasY);
        } else {
            staticCtx.lineTo(i, canvasY);
        }
    }
    staticCtx.stroke();

    // Add labels for axes and key points
    staticCtx.font = '12px Inter, sans-serif';
    staticCtx.fillStyle = '#1f2937';
    
    // Y-axis label
    staticCtx.textAlign = 'right';
    staticCtx.textBaseline = 'middle';
    staticCtx.fillText('y', originX - 5, 10);
    
    // X-axis label
    staticCtx.textAlign = 'center';
    staticCtx.textBaseline = 'top';
    staticCtx.fillText('x', width - 10, originY + 5);
    
    // Origin label
    staticCtx.textAlign = 'right';
    staticCtx.textBaseline = 'top';
    staticCtx.fillText('0', originX - 5, originY + 5);

    // Y-intercept label (at x=0, y=-1)
    const yInterceptY = originY - (-1) * scaleY;
    staticCtx.beginPath();
    staticCtx.arc(originX, yInterceptY, 4, 0, 2 * Math.PI);
    staticCtx.fillStyle = '#2563eb';
    staticCtx.fill();
    staticCtx.fillText('(0,-1)', originX - 10, yInterceptY);
}

// Event listeners to handle resizing and initial load
window.addEventListener('resize', resizeStaticCanvas);
window.onload = function() {
    resizeStaticCanvas();
};

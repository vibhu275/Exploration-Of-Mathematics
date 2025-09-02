document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('parabolaGraphCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const width = container.clientWidth;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // The function to be graphed: f(x) = -x^2 + 2x + 2
    function f(x) {
        return -(x * x) + 2 * x + 2;
    }
    
    // Graph properties
    const scaleX = width / 10;
    const scaleY = height / 6;
    const originX = width / 2;
    const originY = height / 2;

    function drawAxes() {
        ctx.save();
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(width, originY);
        ctx.stroke();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, height);
        ctx.stroke();
    
        ctx.restore();
    }

    function drawFunction() {
        ctx.save();
        ctx.strokeStyle = '#007BFF';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let x_px = 0; x_px < width; x_px++) {
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
    
    function drawLabels() {
        ctx.save();
        ctx.font = '12px Inter';
        ctx.fillStyle = '#1f2937';
        
        // Label the origin
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('0', originX - 5, originY + 5);

        // Label the x-axis
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('x', width - 10, originY + 5);

        // Label the y-axis
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('y', originX - 5, 10);
        
        // Label the vertex (1, 3)
        const vertexX = originX + 1 * scaleX;
        const vertexY = originY - 3 * scaleY;
        ctx.beginPath();
        ctx.arc(vertexX, vertexY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444'; // Red for emphasis
        ctx.fill();
        ctx.fillText('(1, 3)', vertexX, vertexY - 10);

        // Label the y-intercept: (0, 2)
        const yIntY = originY - f(0) * scaleY;
        ctx.beginPath();
        ctx.arc(originX, yIntY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#2563eb';
        ctx.fill();
        ctx.fillText('2', originX - 10, yIntY);
        
        // Label the x-intercepts: (1 - sqrt(3), 0) and (1 + sqrt(3), 0)
        const xInt1 = 1 - Math.sqrt(3);
        const xInt2 = 1 + Math.sqrt(3);
        const xInt1X = originX + xInt1 * scaleX;
        const xInt2X = originX + xInt2 * scaleX;
        ctx.beginPath();
        ctx.arc(xInt1X, originY, 4, 0, 2 * Math.PI);
        ctx.arc(xInt2X, originY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#2563eb';
        ctx.fill();
        ctx.fillText(xInt1.toFixed(2), xInt1X, originY + 15);
        ctx.fillText(xInt2.toFixed(2), xInt2X, originY + 15);

        ctx.restore();
    }
    
    function drawGraph() {
        ctx.clearRect(0, 0, width, height);
        drawAxes();
        drawFunction();
        drawLabels();
    }

    drawGraph();
});
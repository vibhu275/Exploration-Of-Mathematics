function drawGraph() {
    const canvas = document.getElementById('fitzzzz-graph');
    if (!canvas || !canvas.getContext) {
        console.error('Canvas element not found or not supported.');
        return;
    }
    const ctx = canvas.getContext('2d');

    // Set up canvas dimensions and scale
    const width = canvas.width;
    const height = canvas.height;
    const scaleX = 80;
    const scaleY = 40;
    const offsetX = width / 2 - 1 * scaleX;
    const offsetY = height / 2 + 0 * scaleY;

    // Function to convert coordinates
    const toCanvasX = (x) => offsetX + x * scaleX;
    const toCanvasY = (y) => offsetY - y * scaleY;

    // Clear canvas before redrawing
    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(width, offsetY);
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, height);
    ctx.stroke();

    // Arrows for axes
    const arrowSize = 8;
    // X-axis arrow
    ctx.beginPath();
    ctx.moveTo(width - arrowSize, offsetY - arrowSize / 2);
    ctx.lineTo(width, offsetY);
    ctx.lineTo(width - arrowSize, offsetY + arrowSize / 2);
    ctx.fill();
    // Y-axis arrow
    ctx.beginPath();
    ctx.moveTo(offsetX - arrowSize / 2, arrowSize);
    ctx.lineTo(offsetX, 0);
    ctx.lineTo(offsetX + arrowSize / 2, arrowSize);
    ctx.fill();

    // Red parabola: -x^2 + 2x + 2
    ctx.strokeStyle = '#e53e3e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -3; x <= 4; x += 0.01) {
        const y = -x * x + 2 * x + 2;
        const canvasX = toCanvasX(x);
        const canvasY = toCanvasY(y);
        if (x === -3) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Green line: x + 9/4
    ctx.strokeStyle = '#38a169';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -3; x <= 4; x += 0.01) {
        const y = x + 9 / 4;
        const canvasX = toCanvasX(x);
        const canvasY = toCanvasY(y);
        if (x === -3) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Blue line: -x + 13/4
    ctx.strokeStyle = '#4299e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -3; x <= 4; x += 0.01) {
        const y = -x + 13 / 4;
        const canvasX = toCanvasX(x);
        const canvasY = toCanvasY(y);
        if (x === -3) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Intersection points and labels
    ctx.fillStyle = '#2d3748';
    ctx.font = '14px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const drawPoint = (x, y, label, labelOffsetX = 5, labelOffsetY = -5) => {
        ctx.beginPath();
        ctx.arc(toCanvasX(x), toCanvasY(y), 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(label, toCanvasX(x) + labelOffsetX, toCanvasY(y) + labelOffsetY);
    };

    drawPoint(-2.25, 0, 'A', 5, -15);
    drawPoint(0.5, 2.75, 'P(x,y)', 10, -15);
    drawPoint(0.5, 0, 'P\'', 10, 5);
    drawPoint(3.25, 0, 'A\'', 5, 5);
    drawPoint(0, 0, 'O', -15, 5);
    drawPoint(-0.25, 23 / 16, 'Q', -25, -15);
    drawPoint(0.5, 23 / 16, 'Q\'', 10, 5);

    // Dotted lines
    ctx.strokeStyle = '#718096';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    const drawDottedLine = (x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
        ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
        ctx.stroke();
    };

    drawDottedLine(0.5, 0, 0.5, 2.75);
    drawDottedLine(-0.25, 23 / 16, 0.5, 2.75);
    drawDottedLine(-0.25, 23 / 16, 0.5, 23 / 16);

    ctx.setLineDash([]);
}

window.addEventListener('load', drawGraph);
window.addEventListener('resize', () => {
    const canvas = document.getElementById('tikz-graph');
    if (canvas) {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawGraph();
    }
});

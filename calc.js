document.addEventListener('DOMContentLoaded', () => {
    // --- Canvas and Context Setup ---
    const canvas = document.getElementById('tangentGraphCanvas');
    // Ensure the canvas element exists before proceeding
    if (!canvas) {
        console.error("Canvas element with ID 'tangentGraphCanvas' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // Set initial canvas dimensions
    let canvasWidth = canvas.parentElement.clientWidth;
    let canvasHeight = canvasWidth * 0.6; // Maintain aspect ratio
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // --- DOM Element References ---
    const xSlider = document.getElementById('xValue');
    const cSlider = document.getElementById('cValue');
    const xValueLabel = document.getElementById('xValueLabel');
    const cValueLabel = document.getElementById('cValueLabel');
    const slopeDisplay = document.getElementById('slopeDisplay');

    // --- Graphing Parameters ---
    const domain = { min: -6, max: 6 };
    const range = { min: -6, max: 6 };
    let scaleX = canvas.width / (domain.max - domain.min);
    let scaleY = canvas.height / (range.max - range.min);
    let origin = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    // --- Mathematical Functions ---
    const f = (x) => Math.sin(x); // Base function: sin(x)
    const fPrime = (x) => Math.cos(x); // Derivative: cos(x)

    // --- Coordinate Transformation ---
    const toCanvasCoords = (x, y) => {
        return {
            x: origin.x + x * scaleX,
            y: origin.y - y * scaleY
        };
    };

    // --- Drawing Functions ---

    function drawAxes() {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.font = '12px Inter';
        ctx.fillStyle = '#64748b';

        for (let i = Math.floor(domain.min); i <= domain.max; i++) {
            if (i === 0) continue;
            const pos = toCanvasCoords(i, 0);
            ctx.beginPath();
            ctx.moveTo(pos.x, 0);
            ctx.lineTo(pos.x, canvas.height);
            ctx.stroke();
            ctx.fillText(i, pos.x + 5, origin.y - 5);
        }

        for (let i = Math.floor(range.min); i <= range.max; i++) {
            if (i === 0) continue;
            const pos = toCanvasCoords(0, i);
            ctx.beginPath();
            ctx.moveTo(0, pos.y);
            ctx.lineTo(canvas.width, pos.y);
            ctx.stroke();
            ctx.fillText(i, origin.x + 5, pos.y - 5);
        }

        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(0, origin.y);
        ctx.lineTo(canvas.width, origin.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(origin.x, 0);
        ctx.lineTo(origin.x, canvas.height);
        ctx.stroke();
    }

    function drawGraph(c) {
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = domain.min; x <= domain.max; x += 0.01) {
            const y = f(x) + c;
            const canvasPos = toCanvasCoords(x, y);
            if (x === domain.min) {
                ctx.moveTo(canvasPos.x, canvasPos.y);
            } else {
                ctx.lineTo(canvasPos.x, canvasPos.y);
            }
        }
        ctx.stroke();
    }

    function drawTangent(x, c) {
        const y = f(x) + c;
        const slope = fPrime(x);
        const x1 = x - 2.5;
        const y1 = slope * (x1 - x) + y;
        const x2 = x + 2.5;
        const y2 = slope * (x2 - x) + y;
        const startPos = toCanvasCoords(x1, y1);
        const endPos = toCanvasCoords(x2, y2);
        
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();

        const pointPos = toCanvasCoords(x, y);
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(pointPos.x, pointPos.y, 6, 0, 2 * Math.PI);
        ctx.fill();
    }

    function drawScene() {
        const x = parseFloat(xSlider.value);
        const c = parseFloat(cSlider.value);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAxes();
        drawGraph(c);
        drawTangent(x, c);
        xValueLabel.textContent = x.toFixed(2);
        cValueLabel.textContent = c.toFixed(2);
        slopeDisplay.textContent = fPrime(x).toFixed(2);
    }

    function handleResize() {
        canvasWidth = canvas.parentElement.clientWidth;
        canvasHeight = canvasWidth * 0.6;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        scaleX = canvas.width / (domain.max - domain.min);
        scaleY = canvas.height / (range.max - range.min);
        origin = { x: canvas.width / 2, y: canvas.height / 2 };
        drawScene();
    }

    // --- Event Listeners ---
    xSlider.addEventListener('input', drawScene);
    cSlider.addEventListener('input', drawScene);
    window.addEventListener('resize', handleResize);

    // --- Initial Draw ---
    drawScene();
});

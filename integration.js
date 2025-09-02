document.addEventListener('DOMContentLoaded', () => {
    // --- Canvas and Context Setup ---
    const canvas = document.getElementById('integrationCanvas');
    if (!canvas) {
        console.error("Canvas element with ID 'integrationCanvas' not found.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // Set initial canvas dimensions
    let canvasWidth = canvas.parentElement.clientWidth;
    let canvasHeight = canvasWidth * 0.75; // Adjust aspect ratio for this graph
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // --- DOM Element References ---
    const dxSlider = document.getElementById('dxValue');
    const dxValueLabel = document.getElementById('dxValueLabel');
    const rectangleAreaDisplay = document.getElementById('rectangleArea');
    const exactAreaDisplay = document.getElementById('exactArea');

    // --- Graphing Parameters ---
    const domain = { min: -0.5, max: 2.5 };
    const range = { min: -1, max: 5 };
    let scaleX, scaleY, origin;

    // --- Mathematical Functions ---
    const f = (x) => x * x; // The function y = x^2
    // The integral of x^2 is (x^3)/3. We'll use this for the exact area.
    const F = (x) => (x * x * x) / 3;

    /**
     * Recalculates scaling and origin based on canvas size.
     */
    function updateCanvasParameters() {
        canvasWidth = canvas.parentElement.clientWidth;
        canvasHeight = canvasWidth * 0.75;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        scaleX = canvas.width / (domain.max - domain.min);
        scaleY = canvas.height / (range.max - range.min);
        origin = {
            x: -domain.min * scaleX,
            y: range.max * scaleY
        };
    }

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

        // Draw main X and Y axes
        ctx.strokeStyle = '#94a3b8';
        const xAxis = toCanvasCoords(0, 0);
        ctx.beginPath();
        ctx.moveTo(0, xAxis.y);
        ctx.lineTo(canvas.width, xAxis.y);
        ctx.stroke();
        const yAxis = toCanvasCoords(0, 0);
        ctx.beginPath();
        ctx.moveTo(yAxis.x, 0);
        ctx.lineTo(yAxis.x, canvas.height);
        ctx.stroke();

        // Draw labels
        for (let i = Math.floor(domain.min); i <= domain.max; i++) {
            if (i === 0) continue;
            const pos = toCanvasCoords(i, 0);
            ctx.fillText(i, pos.x + 5, pos.y + 15);
        }
        for (let i = Math.floor(range.min); i <= range.max; i++) {
            if (i === 0) continue;
            const pos = toCanvasCoords(0, i);
            ctx.fillText(i, pos.x + 5, pos.y - 5);
        }
    }

    function drawGraph() {
        // Draw the area under the curve first
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // blue-500 with 20% opacity
        ctx.beginPath();
        let startPoint = toCanvasCoords(0, 0);
        ctx.moveTo(startPoint.x, startPoint.y);
        for (let x = 0; x <= 2; x += 0.01) {
            const y = f(x);
            const canvasPos = toCanvasCoords(x, y);
            ctx.lineTo(canvasPos.x, canvasPos.y);
        }
        let endPoint = toCanvasCoords(2, 0);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.closePath();
        ctx.fill();

        // Draw the curve line
        ctx.strokeStyle = '#3b82f6'; // blue-500
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = domain.min; x <= domain.max; x += 0.01) {
            const y = f(x);
            const canvasPos = toCanvasCoords(x, y);
            if (x === domain.min) {
                ctx.moveTo(canvasPos.x, canvasPos.y);
            } else {
                ctx.lineTo(canvasPos.x, canvasPos.y);
            }
        }
        ctx.stroke();
    }

    /**
     * Draws inscribed rectangles (underestimates area for an increasing function).
     * This method is also known as the "left-hand rule".
     * @param {number} dx - The width of each rectangle.
     * @returns {number} The total area of all the rectangles.
     */
    function drawInscribedRectangles(dx) {
        let totalRectangleArea = 0;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // red-500 with 70% opacity
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'; // red-500 with 40% opacity
        
        // Loop from x=0 to x=2 with a step of dx
        for (let x = 0; x < 2; x += dx) {
            // The height of the rectangle is determined by the function's value
            // at the LEFT edge of the interval (f(x)). For an increasing function,
            // this ensures the rectangle is always under the curve.
            const y = f(x); 
            
            const canvasPos = toCanvasCoords(x, y);
            const canvasWidth = dx * scaleX;
            const canvasHeight = y * scaleY;

            ctx.beginPath();
            ctx.rect(canvasPos.x, canvasPos.y, canvasWidth, canvasHeight);
            ctx.fill();
            ctx.stroke();

            totalRectangleArea += y * dx;
        }
        return totalRectangleArea;
    }

    function drawScene() {
        const dx = parseFloat(dxSlider.value);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawAxes();
        drawGraph();
        const rectangleArea = drawInscribedRectangles(dx);

        // Update UI
        dxValueLabel.textContent = dx.toFixed(3);
        rectangleAreaDisplay.textContent = rectangleArea.toFixed(4);
        const exactArea = F(2) - F(0);
        exactAreaDisplay.textContent = exactArea.toFixed(4);
    }

    function handleResize() {
        updateCanvasParameters();
        drawScene();
    }

    // --- Event Listeners ---
    dxSlider.addEventListener('input', drawScene);
    window.addEventListener('resize', handleResize);

    // --- Initial Setup ---
    updateCanvasParameters();
    drawScene();
});

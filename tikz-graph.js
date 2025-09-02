/**
 * This script replicates a TikZ plot on an HTML canvas.
 * It includes functions for plotting mathematical equations, points, and labels.
 */
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("tikz-graph");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // --- Configuration ---
    const config = {
        // Set canvas resolution. Using a larger size for better quality.
        width: 600,
        height: 500,
        // Define the mathematical coordinate range
        xMin: -3,
        xMax: 4,
        yMin: -2,
        yMax: 5,
        // Colors from the TikZ plot
        colors: {
            parabola: 'crimson',
            line1: 'green',
            line2: 'blue',
            axis: '#333',
            points: '#000',
            labels: '#000',
        },
        font: "14px Merriweather"
    };

    // Set canvas dimensions
    canvas.width = config.width;
    canvas.height = config.height;

    // --- Coordinate Mapping ---
    // Function to map math coordinates to canvas pixel coordinates
    const mapPoint = (x, y) => {
        const canvasX = ((x - config.xMin) / (config.xMax - config.xMin)) * config.width;
        const canvasY = ((config.yMax - y) / (config.yMax - config.yMin)) * config.height;
        return { x: canvasX, y: canvasY };
    };

    // --- Drawing Functions ---

    // Draws the axes with arrows
    const drawAxes = () => {
        ctx.strokeStyle = config.colors.axis;
        ctx.lineWidth = 1.5;
        const origin = mapPoint(0, 0);

        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, origin.y);
        ctx.lineTo(config.width, origin.y);
        ctx.stroke();
        // Arrow for X-axis
        ctx.beginPath();
        ctx.moveTo(config.width, origin.y);
        ctx.lineTo(config.width - 10, origin.y - 5);
        ctx.lineTo(config.width - 10, origin.y + 5);
        ctx.closePath();
        ctx.fill();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(origin.x, config.height);
        ctx.lineTo(origin.x, 0);
        ctx.stroke();
        // Arrow for Y-axis
        ctx.beginPath();
        ctx.moveTo(origin.x, 0);
        ctx.lineTo(origin.x - 5, 10);
        ctx.lineTo(origin.x + 5, 10);
        ctx.closePath();
        ctx.fill();
    };

    // Plots a given mathematical function
    const plotFunction = (func, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        const step = (config.xMax - config.xMin) / config.width;
        for (let x = config.xMin; x <= config.xMax; x += step) {
            const y = func(x);
            const p = mapPoint(x, y);
            if (x === config.xMin) {
                ctx.moveTo(p.x, p.y);
            } else {
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();
    };

    // Draws a point and its label
    const drawPoint = (x, y, label, anchor) => {
        const p = mapPoint(x, y);
        // Draw point
        ctx.beginPath();
        ctx.fillStyle = config.colors.points;
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        // Draw label
        ctx.font = config.font;
        ctx.fillStyle = config.colors.labels;
        ctx.textAlign = anchor.h;
        ctx.textBaseline = anchor.v;
        ctx.fillText(label, p.x + anchor.dx, p.y + anchor.dy);
    };
    
    // --- Main Drawing Logic ---
    
    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height);

    // Draw the axes first
    drawAxes();

    // Plot the functions
    plotFunction(x => -x * x + 2 * x + 2, config.colors.parabola); // Red parabola
    plotFunction(x => x + 9 / 4, config.colors.line1);             // Green line
    plotFunction(x => -x + 13 / 4, config.colors.line2);            // Blue line

    // Draw the dotted line from P to P'
    const p = mapPoint(0.5, 2.75);
    const p_prime = mapPoint(0.5, 0);
    ctx.beginPath();
    ctx.strokeStyle = config.colors.points;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]); // Creates a dotted effect
    ctx.moveTo(p_prime.x, p_prime.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.setLineDash([]); // Reset to solid line

    // Draw the points and their labels
    // The anchor object controls the label position relative to the point
    drawPoint(-2.25, 0, 'A', { h: 'right', v: 'bottom', dx: -5, dy: -2 });
    drawPoint(0.5, 2.75, 'P', { h: 'left', v: 'bottom', dx: 5, dy: -5 });
    drawPoint(0.5, 0, "P'", { h: 'left', v: 'top', dx: 5, dy: 5 });
    drawPoint(3.25, 0, "A'", { h: 'left', v: 'bottom', dx: 5, dy: -2 });
    drawPoint(0, 0, 'O', { h: 'right', v: 'top', dx: -5, dy: 5 });
});

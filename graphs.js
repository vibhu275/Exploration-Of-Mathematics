/**
 * This script plots quadratic functions on HTML canvas elements.
 * It is designed to be modular and easily configurable for multiple graphs.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Configuration for all the graphs to be plotted.
    // Each object contains the canvas ID and the coefficients a, b, c for y = ax^2 + bx + c.
    const graphs = [
        { id: "graph1", a: 1, b: -4, c: 3 },    // a > 0, D > 0 (16 - 12 = 4)
        { id: "graph2", a: -1, b: 4, c: -3 },   // a < 0, D > 0 (16 - 12 = 4)
        { id: "graph3", a: 1, b: -2, c: 1 },    // a > 0, D = 0 (4 - 4 = 0)
        { id: "graph4", a: -1, b: 2, c: -1 },   // a < 0, D = 0 (4 - 4 = 0)
        { id: "graph5", a: 1, b: 2, c: 3 },     // a > 0, D < 0 (4 - 12 = -8)
        { id: "graph6", a: -1, b: -2, c: -3 }   // a < 0, D < 0 (4 - 12 = -8)
    ];

    // Plot each graph defined in the configuration array.
    graphs.forEach(graph => {
        plotQuadratic(graph.id, graph.a, graph.b, graph.c);
    });
});

/**
 * Plots a quadratic function on a given canvas element.
 * @param {string} canvasId - The ID of the canvas element.
 * @param {number} a - The 'a' coefficient of the quadratic equation.
 * @param {number} b - The 'b' coefficient of the quadratic equation.
 * @param {number} c - The 'c' coefficient of the quadratic equation.
 */
function plotQuadratic(canvasId, a, b, c) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with id ${canvasId} not found.`);
        return;
    }
    const ctx = canvas.getContext("2d");

    // Set canvas resolution to match its display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // --- Plotting Parameters ---
    const padding = 20;
    const xRange = { min: -5, max: 5 };
    const yRange = { min: -10, max: 10 };

    const plotWidth = canvas.width - 2 * padding;
    const plotHeight = canvas.height - 2 * padding;

    // --- Helper function to map math coordinates to canvas coordinates ---
    const mapPoint = (x, y) => {
        const canvasX = padding + ((x - xRange.min) / (xRange.max - xRange.min)) * plotWidth;
        const canvasY = padding + ((yRange.max - y) / (yRange.max - yRange.min)) * plotHeight;
        return { x: canvasX, y: canvasY };
    };

    // --- Draw Grid and Axes ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Use the `Caveat` font for a more stylized look, matching the page theme
    ctx.font = "14px 'Caveat', cursive";
    ctx.strokeStyle = "#e0e0e0"; // Light grey for grid
    ctx.fillStyle = "#666";
    
    // Draw vertical grid lines and x-axis labels
    for (let i = xRange.min; i <= xRange.max; i++) {
        const p = mapPoint(i, 0);
        ctx.beginPath();
        ctx.moveTo(p.x, padding);
        ctx.lineTo(p.x, canvas.height - padding);
        ctx.stroke();
        if (i !== 0) ctx.fillText(i, p.x - (i < 0 ? 8 : 4), canvas.height - padding/2);
    }

    // Draw horizontal grid lines and y-axis labels
    for (let i = yRange.min; i <= yRange.max; i++) {
        const p = mapPoint(0, i);
        ctx.beginPath();
        ctx.moveTo(padding, p.y);
        ctx.lineTo(canvas.width - padding, p.y);
        ctx.stroke();
        if (i !== 0) ctx.fillText(i, padding/4, p.y + 3);
    }
    
    // Draw main axes
    ctx.strokeStyle = "#888"; // Darker grey for axes
    ctx.lineWidth = 1.5;
    const origin = mapPoint(0, 0);
    ctx.beginPath();
    ctx.moveTo(padding, origin.y);
    ctx.lineTo(canvas.width - padding, origin.y); // X-axis
    ctx.moveTo(origin.x, padding);
    ctx.lineTo(origin.x, canvas.height - padding); // Y-axis
    ctx.stroke();

    // --- Plot the Function ---
    ctx.beginPath();
    ctx.strokeStyle = "crimson";
    ctx.lineWidth = 2.5;
    const step = (xRange.max - xRange.min) / plotWidth;
    let firstPoint = true;

    for (let x = xRange.min; x <= xRange.max; x += step) {
        const y = a * x * x + b * x + c;
        const p = mapPoint(x, y);
        
        // Ensure the line stays within the plot area
        if (p.y >= padding && p.y <= canvas.height - padding) {
            if (firstPoint) {
                ctx.moveTo(p.x, p.y);
                firstPoint = false;
            } else {
                ctx.lineTo(p.x, p.y);
            }
        } else {
            // If point is outside, start a new line segment when it re-enters
            firstPoint = true;
        }
    }
    ctx.stroke();
}

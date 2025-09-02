document.addEventListener('DOMContentLoaded', () => {
            // Get canvas and context
            const canvas = document.getElementById('graph-canvas');
            const ctx = canvas.getContext('2d');

            // Get control elements
            const startButton = document.getElementById('start-button');
            const resetButton = document.getElementById('reset-button');
            const secantSlopeElement = document.getElementById('secant-slope');
            const tangentSlopeElement = document.getElementById('tangent-slope');

            let animationFrameId = null;
            let isAnimating = false;

            // --- Function Definitions ---
            
            // The function for the parabola: f(x) = -0.5*(x - 1.5)^2 + 2.5
            function f(x) {
                return -0.5 * Math.pow(x - 1.5, 2) + 2.5;
            }

            // The derivative of the function: f'(x) = - (x - 1.5)
            function f_prime(x) {
                return -(x - 1.5);
            }

            // Define fixed points
            const pointP = { x: 1.5, y: f(1.5) };
            let pointQ = { x: -2, y: f(-2) };
            
            const tangentSlope = f_prime(pointP.x);
            tangentSlopeElement.textContent = tangentSlope.toFixed(4);

            function toCanvasCoords(x, y, width, height, scaleX, scaleY, originX, originY) {
                return {
                    x: originX + x * scaleX,
                    y: originY - y * scaleY
                };
            }

            function drawExtendedLine(p1, p2, color, ctx, width, height, scaleX, scaleY, originX, originY) {
                const slope = (p2.y - p1.y) / (p2.x - p1.x);
                const intercept = p1.y - slope * p1.x;
                const x1_math = (0 - originX) / scaleX;
                const x2_math = (width - originX) / scaleX;
                const y1_math = slope * x1_math + intercept;
                const y2_math = slope * x2_math + intercept;
                const p1_canvas = toCanvasCoords(x1_math, y1_math, width, height, scaleX, scaleY, originX, originY);
                const p2_canvas = toCanvasCoords(x2_math, y2_math, width, height, scaleX, scaleY, originX, originY);
                
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(p1_canvas.x, p1_canvas.y);
                ctx.lineTo(p2_canvas.x, p2_canvas.y);
                ctx.stroke();
            }

            // Main drawing function
            function drawGraph() {
                const width = canvas.width;
                const height = canvas.height;
                ctx.clearRect(0, 0, width, height);

                const originX = width / 2;
                const originY = height / 2 + 50;
                const scaleX = 100;
                const scaleY = 100;

                // --- Draw Axes ---
                ctx.strokeStyle = '#94a3b8'; // Lighter gray for axes
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, originY);
                ctx.lineTo(width, originY);
                ctx.moveTo(originX, 0);
                ctx.lineTo(originX, height);
                ctx.stroke();

                // --- Draw the Parabola ---
                ctx.strokeStyle = '#ef4444'; // Red
                ctx.lineWidth = 3;
                ctx.beginPath();
                let firstPoint = true;
                for (let i = 0; i < width; i++) {
                    const x = (i - originX) / scaleX;
                    const y = f(x);
                    const canvasY = originY - y * scaleY;
                    if (firstPoint) {
                        ctx.moveTo(i, canvasY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(i, canvasY);
                    }
                }
                ctx.stroke();

                // --- Draw the Tangent Line (PA) ---
                drawExtendedLine(pointP, { x: pointP.x + 1, y: pointP.y + tangentSlope }, '#3b82f6', ctx, width, height, scaleX, scaleY, originX, originY);

                // --- Draw the Secant Line (PQ) ---
                if (Math.abs(pointQ.x - pointP.x) > 0.0001) {
                    drawExtendedLine(pointP, pointQ, '#10b981', ctx, width, height, scaleX, scaleY, originX, originY);
                }

                // --- Draw Points and Labels ---
                ctx.font = '16px "Inter", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const p_canvas = toCanvasCoords(pointP.x, pointP.y, width, height, scaleX, scaleY, originX, originY);
                
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.arc(p_canvas.x, p_canvas.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillText('P(x,y)', p_canvas.x + 25, p_canvas.y - 15);
                
                const q_canvas = toCanvasCoords(pointQ.x, pointQ.y, width, height, scaleX, scaleY, originX, originY);
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.arc(q_canvas.x, q_canvas.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillText('Q', q_canvas.x - 15, q_canvas.y + 15);

                // Draw projections P' and Q'
                ctx.strokeStyle = '#64748b';
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(p_canvas.x, p_canvas.y);
                ctx.lineTo(p_canvas.x, originY);
                ctx.moveTo(q_canvas.x, q_canvas.y);
                ctx.lineTo(q_canvas.x, originY);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = '#1e293b';
                ctx.fillText(`P'`, p_canvas.x, originY + 15);
                ctx.fillText(`Q'`, q_canvas.x, originY + 15);
                ctx.fillText('O', originX - 15, originY + 15);
            }

            // Animation loop
            function animate() {
                if (!isAnimating) return;

                // Move Q closer to P
                const step = 0.02; // *** MODIFIED: Slower animation step ***
                if (pointQ.x < pointP.x) {
                    pointQ.x += step;
                    if (pointQ.x > pointP.x) pointQ.x = pointP.x;
                } else {
                    pointQ.x -= step;
                    if (pointQ.x < pointP.x) pointQ.x = pointP.x;
                }

                pointQ.y = f(pointQ.x);

                const secantSlope = (pointQ.y - pointP.y) / (pointQ.x - pointP.x);
                secantSlopeElement.textContent = isNaN(secantSlope) ? tangentSlope.toFixed(4) : secantSlope.toFixed(4);

                drawGraph();

                if (Math.abs(pointQ.x - pointP.x) < 0.01) {
                    isAnimating = false;
                    startButton.textContent = 'Complete';
                    startButton.disabled = true;
                    secantSlopeElement.textContent = tangentSlope.toFixed(4);
                } else {
                    animationFrameId = requestAnimationFrame(animate);
                }
            }

            // Event listeners
            startButton.addEventListener('click', () => {
                if (!isAnimating) {
                    isAnimating = true;
                    startButton.textContent = 'Animating...';
                    animate();
                }
            });

            resetButton.addEventListener('click', () => {
                cancelAnimationFrame(animationFrameId);
                isAnimating = false;
                startButton.textContent = 'Start Animation';
                startButton.disabled = false;
                pointQ.x = -2;
                pointQ.y = f(pointQ.x);
                secantSlopeElement.textContent = ((f(pointQ.x) - pointP.y) / (pointQ.x - pointP.x)).toFixed(4);
                drawGraph();
            });

            // Make the canvas responsive
            function resizeCanvas() {
                const container = canvas.parentElement;
                canvas.width = container.clientWidth;
                // *** MODIFIED: Responsive height based on width ***
                canvas.height = canvas.width * 0.5; 
                if (canvas.height > window.innerHeight * 0.6) {
                    canvas.height = window.innerHeight * 0.6;
                }
                drawGraph();
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
        });
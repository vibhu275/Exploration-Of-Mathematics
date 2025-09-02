// This script animates a car moving along the graph of f(x) = 3 - |x-1|

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('carAnimationCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    let animationFrameId = null;
    let isPlaying = false;
    let carXPosition = -4; // Starting position of the car on the x-axis
    const carSpeed = 0.02; // Speed of the car's movement
    let time = 0; // For subtle vertical animation

    // Graph properties - these can be adjusted to change the scale
    const graphWidth = 10; // Units on the x-axis to display
    const graphHeight = 6; // Units on the y-axis to display
    let scaleX, scaleY, originX, originY;

    // The function the car will follow
    function f(x) {
        return 3 - Math.abs(x - 1);
    }
    
    // Function to calculate the slope of the function at a given x-value
    // This is the derivative of f(x) = 3 - |x-1|
    function f_prime(x) {
        if (x > 1) {
            return -1;
        } else if (x < 1) {
            return 1;
        } else {
            // At x = 1, the derivative is undefined (sharp point)
            // We'll approximate the slope based on the direction of movement.
            return (carSpeed > 0) ? -1 : 1;
        }
    }
    
    // Function to handle canvas resizing
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = 400; // Fixed height for a good aspect ratio
        
        // Recalculate drawing parameters based on new canvas size
        scaleX = canvas.width / graphWidth;
        scaleY = canvas.height / graphHeight;
        originX = canvas.width / 2;
        originY = canvas.height / 2;
        
        drawScene();
    }

    // Function to draw the axes and labels
    function drawAxes() {
        ctx.save();
        ctx.strokeStyle = '#6b7280'; // gray-500
        ctx.lineWidth = 1;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(canvas.width, originY);
        ctx.stroke();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, canvas.height);
        ctx.stroke();

        // Draw labels
        ctx.font = '12px Inter';
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('0', originX - 5, originY + 5);
        ctx.fillText('y', originX - 5, 10);
        ctx.fillText('x', canvas.width - 10, originY + 5);
        ctx.restore();
    }

    // Function to draw the graph of the function
    function drawFunction() {
        ctx.save();
        ctx.strokeStyle = '#2563eb'; // blue-600
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let x_px = 0; x_px < canvas.width; x_px++) {
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
    
    // Function to draw a more realistic car at a specific (x, y) coordinate
    function drawCar(x, y, slope) {
        ctx.save();
        
        const carWidth = 50;
        const carHeight = 25;
        const wheelRadius = 8;
        const wheelXOffset = 15;
        const bounce = Math.sin(time * 5) * 1.5; // Creates a subtle bounce effect

        // Convert graph coordinates to canvas pixel coordinates
        const carX_px = originX + x * scaleX;
        const carY_px = originY - y * scaleY;
        
        // Translate to the car's position on the canvas
        ctx.translate(carX_px, carY_px + bounce);
        
        // Rotate the entire car based on the slope of the graph
        const rotationAngle = Math.atan(slope);
        ctx.rotate(rotationAngle);
        
        // Draw wheels first, centered on the graph line
        ctx.fillStyle = '#1f2937'; // Dark gray
        ctx.beginPath();
        ctx.arc(-wheelXOffset, 0, wheelRadius, 0, 2 * Math.PI); // Front wheel
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wheelXOffset, 0, wheelRadius, 0, 2 * Math.PI); // Back wheel
        ctx.fill();

        // Now draw the car body above the wheels
        ctx.fillStyle = '#ef4444'; // Red
        ctx.beginPath();
        ctx.roundRect(-carWidth / 2, -carHeight, carWidth, carHeight, 8);
        ctx.fill();

        // Draw car roof/cockpit
        ctx.fillStyle = '#4B5563'; // Darker gray for the top
        ctx.beginPath();
        ctx.moveTo(-10, -carHeight);
        ctx.lineTo(15, -carHeight);
        ctx.lineTo(10, -carHeight - 15);
        ctx.lineTo(-5, -carHeight - 15);
        ctx.closePath();
        ctx.fill();

        // Draw windows
        ctx.fillStyle = '#FFFFFF'; // White for windows
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.roundRect(-8, -carHeight - 13, 8, 12, 2); // Front window
        ctx.roundRect(0, -carHeight - 13, 8, 12, 2); // Back window
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.restore();
    }

    // Main animation loop
    function animate() {
        if (!isPlaying) {
            cancelAnimationFrame(animationFrameId);
            return;
        }

        // Update car position
        carXPosition += carSpeed;
        if (carXPosition > 5) {
            carXPosition = -4; // Loop the animation
        }
        
        time += 0.1; // Update time for bouncing effect

        // Calculate the slope at the new position
        const slope = f_prime(carXPosition);
        
        // Draw everything
        drawScene();
        drawCar(carXPosition, f(carXPosition), slope); // Pass the slope to the drawCar function
        
        animationFrameId = requestAnimationFrame(animate);
    }

    // Function to draw all elements
    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAxes();
        drawFunction();
    }
    
    // Event listener for the play/pause button
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playPauseBtn.textContent = 'Pause Animation';
            animate();
        } else {
            playPauseBtn.textContent = 'Play Animation';
        }
    });

    // Initial setup
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('load', () => {
        resizeCanvas();
        playPauseBtn.textContent = 'Play Animation'; // Initial button text
        drawCar(carXPosition, f(carXPosition), f_prime(carXPosition)); // Draw the car in its initial position
    });
});
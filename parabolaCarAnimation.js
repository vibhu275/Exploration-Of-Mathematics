// This script animates a car moving along the graph of f(x) = -(x^2-2x)+2

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('parabolaCarAnimationCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const playPauseBtn = document.getElementById('parabolaPlayPauseBtn');
    
    let animationFrameId = null;
    let isPlaying = false;
    let carXPosition = -2; // Starting position of the car on the x-axis
    const carSpeed = 0.02; // Speed of the car's movement

    // Graph properties - these can be adjusted to change the scale
    const graphWidth = 10; // Units on the x-axis to display
    const graphHeight = 8; // Units on the y-axis to display
    let scaleX, scaleY, originX, originY;

    // The function the car will follow
    function f(x) {
        return -(x * x) + 2 * x + 2;
    }
    
    // Function to handle canvas resizing
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = 400; // Fixed height for a good aspect ratio
        
        // Recalculate drawing parameters based on new canvas size
        scaleX = canvas.width / graphWidth;
        scaleY = canvas.height / graphHeight;
        originX = canvas.width / 2;
        originY = canvas.height / 2 + 50; // Adjusted origin for the parabola
        
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
    
    // Function to draw the car at a specific (x, y) coordinate
    function drawCar(x, y) {
        ctx.save();
        
        // Convert graph coordinates to canvas pixel coordinates
        const carX_px = originX + x * scaleX;
        const carY_px = originY - y * scaleY;
        
        // Car body
        const carBodyHeight = 15;
        const carBodyWidth = 30;
        ctx.fillStyle = '#ef4444'; // Red color
        ctx.beginPath();
        ctx.roundRect(carX_px - carBodyWidth / 2, carY_px - carBodyHeight, carBodyWidth, carBodyHeight, 5);
        ctx.fill();

        // Car wheels
        const wheelRadius = 5;
        const wheelY_px = carY_px + wheelRadius / 2;
        ctx.fillStyle = '#1f2937'; // Dark gray for wheels
        
        // Left wheel
        ctx.beginPath();
        ctx.arc(carX_px - 10, wheelY_px, wheelRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Right wheel
        ctx.beginPath();
        ctx.arc(carX_px + 10, wheelY_px, wheelRadius, 0, 2 * Math.PI);
        ctx.fill();
        
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
        if (carXPosition > 4) {
            carXPosition = -2; // Loop the animation
        }

        // Draw everything
        drawScene();
        
        animationFrameId = requestAnimationFrame(animate);
    }

    // Function to draw all elements
    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAxes();
        drawFunction();
        drawCar(carXPosition, f(carXPosition));
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
    });
});

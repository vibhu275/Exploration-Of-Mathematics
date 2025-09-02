document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('trigChart').getContext('2d');
    let chart;
    let xMin, xMax, yMin, yMax;

    // Define the functions, their domains, and ranges for initial view
    const functions = {
        'sin': { func: Math.sin, domain: [-10, 10], range: [-1.5, 1.5] },
        'cos': { func: Math.cos, domain: [-10, 10], range: [-1.5, 1.5] },
        'tan': { func: Math.tan, domain: [-10, 10], range: [-10, 10] },
        'csc': { func: x => 1 / Math.sin(x), domain: [-10, 10], range: [-10, 10] },
        'sec': { func: x => 1 / Math.cos(x), domain: [-10, 10], range: [-10, 10] },
        'cot': { func: x => 1 / Math.tan(x), domain: [-10, 10], range: [-10, 10] },
        'asin': { func: Math.asin, domain: [-1.5, 1.5], range: [-Math.PI / 2 - 0.5, Math.PI / 2 + 0.5] },
        'acos': { func: Math.acos, domain: [-1.5, 1.5], range: [-0.5, Math.PI + 0.5] },
        'atan': { func: Math.atan, domain: [-10, 10], range: [-Math.PI / 2 - 0.5, Math.PI / 2 + 0.5] },
        'acsc': { func: x => Math.asin(1 / x), domain: [-10, 10], range: [-Math.PI / 2 - 0.5, Math.PI / 2 + 0.5] },
        'asec': { func: x => Math.acos(1 / x), domain: [-10, 10], range: [-0.5, Math.PI + 0.5] },
        'acot': { func: x => Math.PI / 2 - Math.atan(x), domain: [-10, 10], range: [-0.5, Math.PI + 0.5] }
    };

    /**
     * Generates the data points for the selected function.
     * @param {string} funcName - The name of the function to plot.
     * @returns {Array} An array of data points {x, y}.
     */
    function generateData(funcName) {
        const selected = functions[funcName];
        const data = [];
        const step = (xMax - xMin) / 1000; // Increased resolution

        for (let x = xMin; x <= xMax; x += step) {
            const y = selected.func(x);
            
            // Handle discontinuities for tan, sec, csc, cot by inserting nulls
            if (['tan', 'csc', 'sec', 'cot'].includes(funcName)) {
                if (Math.abs(y) > 20) { // Arbitrary large value to detect asymptotes
                    data.push({x: x, y: null});
                } else {
                    data.push({x: x, y: y});
                }
            // Handle restricted domains for inverse sin/cos
            } else if (['asin', 'acos'].includes(funcName)) {
                if (x >= -1 && x <= 1) {
                     data.push({ x: x, y: y });
                }
            // Handle restricted domains for inverse csc/sec
            } else if (['acsc', 'asec'].includes(funcName)) {
                if (x <= -1 || x >= 1) {
                    data.push({ x: x, y: y });
                }
            }
            else {
                data.push({x: x, y: y});
            }
        }
        return data;
    }

    /**
     * Creates or updates the chart with the selected function.
     * @param {string} funcName - The name of the function to plot.
     */
    function createChart(funcName) {
        const selected = functions[funcName];
        // Set initial view boundaries from the function's definition
        xMin = selected.domain[0];
        xMax = selected.domain[1];
        yMin = selected.range[0];
        yMax = selected.range[1];
        
        const data = generateData(funcName);

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: funcName + '(x)',
                    data: data,
                    showLine: true,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    pointRadius: 0,
                    borderWidth: 2,
                    tension: 0.1 // Smooths the curve slightly
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: xMin,
                        max: xMax,
                        title: {
                            display: true,
                            text: 'x'
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    },
                    y: {
                        min: yMin,
                        max: yMax,
                        title: {
                            display: true,
                            text: 'y'
                        },
                         grid: {
                            color: '#e0e0e0'
                        }
                    }
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x', // Allow panning only on the x-axis
                            onPanComplete: ({chart}) => {
                                xMin = chart.scales.x.min;
                                xMax = chart.scales.x.max;
                                updateChartData();
                            }
                        },
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: 'xy',
                            onZoomComplete: ({chart}) => {
                                xMin = chart.scales.x.min;
                                xMax = chart.scales.x.max;
                                yMin = chart.scales.y.min;
                                yMax = chart.scales.y.max;
                                updateChartData();
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                    legend: {
                        position: 'top',
                    },
                },
                animation: false // Disable animation for performance
            }
        });
    }
    
    /**
     * Regenerates data and updates the chart without full recreation.
     * This is called after a pan or zoom action.
     */
    function updateChartData() {
        const selectedFunc = document.getElementById('function-select').value;
        chart.data.datasets[0].data = generateData(selectedFunc);
        chart.options.scales.x.min = xMin;
        chart.options.scales.x.max = xMax;
        chart.options.scales.y.min = yMin;
        chart.options.scales.y.max = yMax;
        chart.update('none'); // 'none' prevents animation on update
    }
    
    // --- Event Listeners ---
    
    document.getElementById('function-select').addEventListener('change', (e) => {
        createChart(e.target.value);
    });

    document.getElementById('zoom-in').addEventListener('click', () => {
        chart.zoom(1.2);
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        chart.zoom(0.8);
    });
    
    document.getElementById('reset-zoom').addEventListener('click', () => {
         const selectedFunc = document.getElementById('function-select').value;
         createChart(selectedFunc);
    });

    // Initial chart on page load
    createChart('sin');
});

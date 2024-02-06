// Version 2
const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'Looping tension',
      data: [65, 59, 80, 81, 26, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
    }]
  };
  
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('chart').getContext('2d');

    const customClipPlugin = {
        id: 'customClip',
        beforeDraw: function(chart, args, options) {
            const {ctx, chartArea} = chart;
            const {left, right, top, bottom} = chartArea;
            const width = right - left;
            const progress = options.progress; // Use the progress option to determine the clip area

            ctx.save();
            ctx.beginPath();
            ctx.rect(left, top, width * progress, bottom - top);
            ctx.clip();
        },
        afterDraw: function(chart) {
            chart.ctx.restore();
        }
    };

    let progress = 0; // Initial progress is 0, meaning the clip area is initially empty
    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            animation: {
                duration: 0 // Disable the default animation
            },
            plugins: {
                customClip: {
                    progress: 0 // Initialize the plugin option for progress
                }
            }
        },
        plugins: [customClipPlugin]
    });

    // Function to update the progress and redraw the chart
    function animate() {
        progress += 0.01; // Increment progress
        if (progress <= 1) {
            chart.options.plugins.customClip.progress = progress;
            chart.update('none'); // Update the chart without animation
            requestAnimationFrame(animate); // Continue the animation loop
        }
    }

    animate(); // Start the animation
});


/*
// Version 1



  document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('chart').getContext('2d');
    let progress = 0; // Variable to store the current progress of the animation

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            animation: {
                duration: 1000, // Duration of the animation in milliseconds
                easing: 'inOutQuart', // Easing function to use for the animation
                onProgress: function(animation) {
                    progress = animation.currentStep / animation.numSteps;
                }
            },
            scales: {
                x: {
                    display: true // Ensure X-axis labels are displayed
                },
                y: {
                    display: true // Ensure Y-axis labels are displayed
                }
            }
        },
        plugins: [{
            id: 'customClip',
            beforeDatasetDraw: function(chart, args) {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                const width = chartArea.right - chartArea.left;

                if (args.index === 0) { // Apply only to the first dataset
                    ctx.save();
                    // Clip the drawing area for the dataset
                    ctx.beginPath();
                    ctx.rect(chartArea.left, chartArea.top, width * progress, chartArea.bottom - chartArea.top);
                    ctx.clip();
                }
            },
            afterDatasetDraw: function(chart, args) {
                if (args.index === 0) { // Apply only to the first dataset
                    chart.ctx.restore();
                }
            }
        }]
    });
});
*/
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
    let progress = 0; // Variable to store the current progress of the animation

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            animation: {
                duration: 2000, // Duration of the animation in milliseconds
                easing: 'linear', // Easing function to use for the animation
                onProgress: function(animation) {
                    progress = animation.currentStep / animation.numSteps;
                }
            },
            plugins: {
                // Define a plugin to clip the drawing area of the chart
                decimation: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            }
        },
        plugins: [{
            id: 'customClip',
            beforeDraw: function(chart, args, options) {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                const width = chartArea.right - chartArea.left;
                const height = chartArea.bottom - chartArea.top;

                ctx.save();
                // Clip the drawing area to only the portion that should be currently visible
                ctx.beginPath();
                ctx.rect(chartArea.left, chartArea.top, width * progress, height);
                ctx.clip();
            },
            afterDraw: function(chart) {
                chart.ctx.restore();
            }
        }]
    });
});

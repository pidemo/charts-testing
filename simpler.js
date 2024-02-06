// Version 3

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

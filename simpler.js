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

new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: stockData
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (Close)'
        }
      }
    },
    animation: {
      // Define the animation duration
      duration: 2000, // Total animation duration in milliseconds
      onComplete: function(animation) {
        // Optional: callback function to perform actions after the animation completes
      }
    },
    plugins: {
      // Use the 'tooltip' plugin configuration to delay showing tooltips if necessary
      tooltip: {
        enabled: false // Disable tooltips during the animation if desired
      }
    },
    elements: {
      line: {
        tension: 0 // Set to 0 to draw straight lines
      },
      point: {
        radius: function(context) {
          // Dynamically set the radius of each point
          var index = context.dataIndex;
          var size = context.dataset.data.length;
          var currentAnimationStep = context.chart._animationFrame ? context.chart._animationFrame : 0;
          var animationStepSize = context.chart.animating ? size / (context.chart.options.animation.duration / 16.66) : size;
          if (index <= currentAnimationStep / animationStepSize) {
            return 3; // Size of the point
          }
          return 0; // Hide the point if it's not yet time to display it
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    }
  }
});

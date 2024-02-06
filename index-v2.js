// Version 3

document.addEventListener('DOMContentLoaded', function () {
    const stocks = document.querySelectorAll('.stock-wrapper');
  
    let maxLength = 0;
    let stockData = [];
    
    // 1. Determine the longest trading history
    stocks.forEach(stock => {
      const jsonData = JSON.parse(stock.querySelector('.item-data').textContent);
      const dataLength = Object.keys(jsonData["Monthly Time Series"]).length;
      if (dataLength > maxLength) {
        maxLength = dataLength;
      }
    });

    console.log(stocks);
  
    // 2. Process each stock and prepare its data
    stocks.forEach(stock => {
      const name = stock.querySelector('.item-name').textContent;
      const ticker = stock.querySelector('.item-ticker').textContent;
      const colorDiv = stock.querySelector('.item-color');
      const color = colorDiv.style.backgroudColor;
      const jsonData = JSON.parse(stock.querySelector('.item-data').textContent);
      const tradingDates = Object.keys(jsonData["Monthly Time Series"]);
      const data = new Array(maxLength).fill(null); // Initialize array with nulls

      console.log(ticker, color);
  
      // Fill in data from the end, assuming data starts from the latest month backwards
      for (let i = 0; i < tradingDates.length; i++) {
        const monthIndex = maxLength - i - 1; // Calculate index based on length
        data[monthIndex] = jsonData["Monthly Time Series"][tradingDates[i]]["4. close"];
      }

  
      // Add this stock's data to the array
      stockData.push({
        label: `${name} (${ticker})`,
        data: data,
        fill: false,
        borderColor: color,
        //borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
        tension: 0.1
      });
    });
  
    // Assuming a sequential timeline for x-axis labels
    const labels = Array.from({ length: maxLength }, (_, i) => `Month ${i + 1}`);
  
    // 3. Render the chart
    const ctx = document.getElementById('chart').getContext('2d');
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
          animations: {
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
      
      
  });
/*

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
*/
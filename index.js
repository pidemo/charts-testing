// Version 3

document.addEventListener('DOMContentLoaded', function () {
    const stocks = document.querySelectorAll('.stock-wrapper');
  
    let allDatesSet = new Set(); // Use a set to collect unique dates
    let stockData = [];
  
    // Collect all unique dates from all stocks
    stocks.forEach(stock => {
      const jsonData = JSON.parse(stock.querySelector('.item-data').textContent);
      const tradingDates = Object.keys(jsonData["Monthly Time Series"]);
      tradingDates.forEach(date => allDatesSet.add(date));
    });
  
    // Convert the set to an array and sort the dates
    let allDates = Array.from(allDatesSet);
    allDates.sort((a, b) => new Date(a) - new Date(b));
  
    // Process each stock and prepare its data
    stocks.forEach(stock => {
      const name = stock.querySelector('.item-name').textContent;
      const ticker = stock.querySelector('.item-ticker').textContent;
      const color = stock.querySelector('.item-color').style.backgroundColor;
      const jsonData = JSON.parse(stock.querySelector('.item-data').textContent);
      const data = allDates.map(date => {
        if (jsonData["Monthly Time Series"][date]) {
          return jsonData["Monthly Time Series"][date]["4. close"];
        } else {
          return null; // This stock has no data for this date
        }
      });
  
      console.log(color);

      // Add this stock's data to the array
      stockData.push({
        label: `${name} (${ticker})`,
        data: data,
        fill: false,
        borderColor: color, //`#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
        tension: 0.1
      });
    });
    
        // plugin part
        const getOrCreateLegendList = (chart, id) => {
            const legendContainer = document.getElementById(id);
            let listContainer = legendContainer.querySelector('ul');
          
            if (!listContainer) {
              listContainer = document.createElement('ul');
              listContainer.style.display = 'flex';
              listContainer.style.flexDirection = 'row';
              listContainer.style.margin = 0;
              listContainer.style.padding = 0;
          
              legendContainer.appendChild(listContainer);
            }
          
            return listContainer;
          };
          
          const htmlLegendPlugin = {
            id: 'htmlLegend',
            afterUpdate(chart, args, options) {
              const ul = getOrCreateLegendList(chart, options.containerID);
          
              // Remove old legend items
              while (ul.firstChild) {
                ul.firstChild.remove();
              }
          
              // Reuse the built-in legendItems generator
              const items = chart.options.plugins.legend.labels.generateLabels(chart);
          
              items.forEach(item => {
                const li = document.createElement('li');
                li.style.alignItems = 'center';
                li.style.cursor = 'pointer';
                li.style.display = 'flex';
                li.style.flexDirection = 'row';
                li.style.marginLeft = '10px';
          
                li.onclick = () => {
                  const {type} = chart.config;
                  if (type === 'pie' || type === 'doughnut') {
                    // Pie and doughnut charts only have a single dataset and visibility is per item
                    chart.toggleDataVisibility(item.index);
                  } else {
                    chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                  }
                  chart.update();
                };
          
                // Color box
                const boxSpan = document.createElement('span');
                boxSpan.style.background = item.fillStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + 'px';
                boxSpan.style.display = 'inline-block';
                boxSpan.style.flexShrink = 0;
                boxSpan.style.height = '20px';
                boxSpan.style.marginRight = '10px';
                boxSpan.style.width = '20px';
          
                // Text
                const textContainer = document.createElement('p');
                textContainer.style.color = item.fontColor;
                textContainer.style.margin = 0;
                textContainer.style.padding = 0;
                textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
          
                const text = document.createTextNode(item.text);
                textContainer.appendChild(text);
          
                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
              });
            }
          };

    // Render the chart v1
    /*
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDates, // Use the sorted dates as labels
            datasets: stockData
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                    parser: 'yyyy-MM-dd', // Specify the date format if necessary
                    tooltipFormat: 'MMM yyyy',
                    unit: 'month'
                    },
                    title: {
                    display: true,
                    text: 'Date'
                    }
                },
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
            },
            plugins: {
                htmlLegend: {
                    containerID: 'legend-box',
                },
                legend: {
                    display: false,
                },
                // Use the 'tooltip' plugin configuration to delay showing tooltips if necessary
                // tooltip: {
                //    enabled: false // Disable tooltips during the animation if desired
                //  }
            }
        },
        plugins: [htmlLegendPlugin],
    });
    */

    // Render chart v2 
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
    
  

/*
// Version 2

document.addEventListener('DOMContentLoaded', function () {
    // Get all stock elements
    const stocks = document.querySelectorAll('.stock-wrapper');
  
    let longestTradingPeriod = [];
    let stockData = [];
  
    stocks.forEach(stock => {
      const name = stock.querySelector('.item-name').textContent;
      const ticker = stock.querySelector('.item-ticker').textContent;
      const jsonData = JSON.parse(stock.querySelector('.item-data').textContent);
      const tradingDates = Object.keys(jsonData["Monthly Time Series"]);
      const dataPoints = tradingDates.map(date => ({
        t: new Date(date),
        y: jsonData["Monthly Time Series"][date]["4. close"]
      }));
  
      // Add this stock's data to the array
      stockData.push({
        label: `${name} (${ticker})`,
        data: dataPoints,
        fill: false,
        borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
        tension: 0.1
      });
  
      // Update the longest trading period if this stock has a longer history
      if (tradingDates.length > longestTradingPeriod.length) {
        longestTradingPeriod = tradingDates.sort((a, b) => new Date(a) - new Date(b));
      }
    });
  
    // Prepare the chart
    const ctx = document.getElementById('chart').getContext('2d'); // Ensure you have a <canvas id="chart"></canvas> in HTML
    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: stockData
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              tooltipFormat: 'MMM YYYY'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price (Close)'
            }
          }
        }
      }
    });
});  

*/
});

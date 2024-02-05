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
        }
      }
    });
    */
   // Render chart v2
   const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    // Your datasets and labels here
  },
  options: {
    // Existing configuration options here
    animation: {
      // Animate along the x axis
      x: {
        type: 'number',
        easing: 'linear',
        duration: 1500, // Animation duration in milliseconds
        from: 0, // Start from the left of the chart
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * 150; // Delay between each line's animation
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: 1500,
        from: (ctx) => {
          if (ctx.type === 'data') {
            const controller = ctx.chart.controllers[0];
            const yScale = controller.scales.y;
            return yScale.getPixelForValue(yScale.min);
          }
          return 0;
        },
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * 150; // Delay can be adjusted for each dataset
        }
      }
    }
  }
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
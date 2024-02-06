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
  
    // 2. Process each stock and prepare its data
    stocks.forEach(stock => {
      const name = stock.querySelector('.item-name').textContent;
      const ticker = stock.querySelector('.item-ticker').textContent;
      const colorDiv = stock.querySelector('.item-color');
      const color = colorDiv.style.backgroudColor;
      const jsonData = JSON.parse(stock.querySelector('.item-data').textContent);
      const tradingDates = Object.keys(jsonData["Monthly Time Series"]);
      const data = new Array(maxLength).fill(null); // Initialize array with nulls

      console.log(color);
  
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
            // Animate the x-axis from 0 to 100%
            x: {
              type: 'number',
              easing: 'linear',
              duration: 2000, // Duration in milliseconds
              from: 0, // Start from 0 (0%)
              // The 'to' property is not needed because it defaults to the natural end value (100%)
              delay(ctx) {
                if (ctx.type === 'data' && ctx.mode === 'default' && !ctx.dropped) {
                  return ctx.dataIndex * 100 + ctx.datasetIndex * 1000;
                  // This delay calculation can be adjusted based on your preference
                  // for the delay between each line drawing.
                }
                return 0;
              }
            },
            // Optionally, if you want to animate the y-axis as well, you can add similar configuration for 'y'
          }
        }
      });      
  });
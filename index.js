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
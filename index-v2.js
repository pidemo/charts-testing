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
        }
      }
    });
  });
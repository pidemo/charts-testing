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
    
    // Render the chart v1
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
    });
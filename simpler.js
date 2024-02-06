// Version 3

document.addEventListener('DOMContentLoaded', function () {
    
    // Render the chart v1
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5], // Use the sorted dates as labels
            datasets: [28, 31, 29, 33, 37]
        }});
    });
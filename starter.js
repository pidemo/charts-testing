const ctx = document.getElementById('myChart');

const day = [
    { x: Date.parse('2024-02-14'), y: 19 },
    { x: Date.parse('2024-02-15'), y: 12 },
    { x: Date.parse('2024-02-16'), y: 15 },
    { x: Date.parse('2024-02-17'), y: 16 },
    { x: Date.parse('2024-02-18'), y: 14 },
    { x: Date.parse('2024-02-19'), y: 11 }
];

const config = {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
    },
    options: {
        scales: {
            /*
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            },
            */
            y: {
                beginAtZero: true
            }
        }
    }
};

new Chart(ctx, config);



  /* 
  
  // Starter Bundle

  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  */
const ctx = document.getElementById('chart');

const day = [
    { x: Date.parse('2024-02-14'), y: 19 },
    { x: Date.parse('2024-02-15'), y: 12 },
    { x: Date.parse('2024-02-16'), y: 15 },
    { x: Date.parse('2024-02-17'), y: 16 },
    { x: Date.parse('2024-02-18'), y: 14 },
    { x: Date.parse('2024-02-19'), y: 11 }
];

const data = {
    //labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
        label: 'Weekly Sales',
        data: day,
        //data: [18,12,6,9,12,3,9],
        borderColor: [
            'rgba(255,26,104,1)',
            'rgba(255,162,235,1)',
            'rgba(255,206,86,1)',
            'rgba(255,192,192,1)',
            'rgba(255,102,255,1)',
            'rgba(255,159,64,1)',
            'rgba(0,0,0,1)'
        ],
        borderWidth: 1
    }]
}

const config = {
    type: 'line',
    data,
    //data: {labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],datasets: [{label: '# of Votes',data: [12, 19, 3, 5, 2, 3],borderWidth: 1}]},
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            },
            
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
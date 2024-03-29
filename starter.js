const ctx = document.getElementById('chart');

const day = [
    { x: Date.parse('2024-02-11 00:00:00 GMT+0100'), y: 19 },
    { x: Date.parse('2024-02-12 00:00:00 GMT+0100'), y: 12 },
    { x: Date.parse('2024-02-13 00:00:00 GMT+0100'), y: 15 },
    { x: Date.parse('2024-02-14 00:00:00 GMT+0100'), y: 16 },
    { x: Date.parse('2024-02-15 00:00:00 GMT+0100'), y: 14 },
    { x: Date.parse('2024-02-16 00:00:00 GMT+0100'), y: 11 }
];

const week = [
    { x: Date.parse('2024-02-11 00:00:00 GMT+0100'), y: 19 },
    { x: Date.parse('2024-02-18 00:00:00 GMT+0100'), y: 21 },
    { x: Date.parse('2024-02-25 00:00:00 GMT+0100'), y: 18 },
    { x: Date.parse('2024-03-03 00:00:00 GMT+0100'), y: 33 },
    { x: Date.parse('2024-03-10 00:00:00 GMT+0100'), y: 35 },
    { x: Date.parse('2024-03-17 00:00:00 GMT+0100'), y: 28 }
];

const month = [
    { x: Date.parse('2024-02-01 00:00:00 GMT+0100'), y: 19 },
    { x: Date.parse('2024-03-01 00:00:00 GMT+0100'), y: 30 },
    { x: Date.parse('2024-04-01 00:00:00 GMT+0100'), y: 26 },
    { x: Date.parse('2024-05-01 00:00:00 GMT+0100'), y: 24 },
    { x: Date.parse('2024-06-01 00:00:00 GMT+0100'), y: 18 },
    { x: Date.parse('2024-07-01 00:00:00 GMT+0100'), y: 26 },
    { x: Date.parse('2024-08-01 00:00:00 GMT+0100'), y: 44 }
];

const colors = [
    'rgba(255,26,104,1)',
    'rgba(255,162,235,1)',
    'rgba(255,206,86,1)',
    'rgba(255,192,192,1)',
    'rgba(255,102,255,1)',
    'rgba(255,159,64,1)',
    'rgba(0,0,0,1)'
];

const data = {
    datasets: [{
        label: 'Weekly Sales',
        data: month,
        borderColor: colors,
        borderWidth: 1
    }]
}

const config = {
    type: 'line',
    data,
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month'
                }
            },  
            y: {
                //beginAtZero: true
            }
        },
        transitions: {
            show: {
              animations: {
                x: {from: 0},
                y: {from: 0}
              }
            },
            hide: {
              animations: {
                x: {to: 0},
                y: {to: 0}
              }
            }
        }
    }
};

const myChart = new Chart(ctx, config);


// buttons setup
function timeFrame(period) {
    if (period.value == 'day') {
        myChart.config.options.scales.x.time.unit = period.value;
        myChart.config.data.datasets[0].data = day;
    };
    if (period.value == 'week') {
        myChart.config.options.scales.x.time.unit = period.value;
        myChart.config.data.datasets[0].data = week;
    };
    if (period.value == 'month') {
        myChart.config.options.scales.x.time.unit = period.value;
        myChart.config.data.datasets[0].data = month;
    };
    myChart.update();
};
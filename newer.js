
const ctx = document.getElementById('chart');

const itemsData = Array.from(document.querySelectorAll('.values')).map(p => JSON.parse(p.textContent));

const labels = Object.keys(itemsData[0].Data).sort(); // Assuming all items have the same dates, get them sorted
const datasets = itemsData.map(item => ({
        label: item.Metadata.Name,
        borderColor: item.Metadata.Color,
        data: labels.map(label => item.Data[label]),
        fill: false,
}));

// get half datasets
const midpointLabels = Math.ceil(labels.length / 2);
const labelsShort = labels.slice(midpointLabels);
const datasetsShort = datasets.map(dataset => ({
    ...dataset, // Copy all existing properties of the dataset (label, borderColor, etc.)
    data: dataset.data.slice(midpointLabels) // Replace the data property with only the second half of its values
}));


const config = {
    type: 'line',
    //data,
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        legend: {
            display: false, // Disable the default legend
        },
        interaction:{
            mode: 'index'
        },
        scales: {
            y: {
                beginAtZero: false
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

// buttons setup
function timeFrame(period) {
    if (period.value == 'long') {
        myChart.config.data.labels = labels;
        myChart.config.data.datasets = datasets;
    };
    if (period.value == 'short') {
        myChart.config.data.labels = labelsShort;
        myChart.config.data.datasets = datasetsShort;
    };
    myChart.update();
};

const myChart = new Chart(ctx, config);



const ctx = document.getElementById('chart');

const itemsData = Array.from(document.querySelectorAll('.values')).map(p => JSON.parse(p.textContent));

const labels = Object.keys(itemsData[0].Data).sort(); // Assuming all items have the same dates, get them sorted
const datasets = itemsData.map(item => ({
        label: item.Metadata.Name,
        borderColor: item.Metadata.Color,
        data: labels.map(label => item.Data[label]),
        fill: false,
}));

const config = {
    type: 'line',
    //data,
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        animation,
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


const myChart = new Chart(ctx, config);

const legendContainer = document.getElementById('legend-wrapper');
// note to later self : do this also for datasetsShort, and wrap each legend set in a different div, and toggle their visibility on click function
datasets.forEach((dataset, index) => {
    // Create the legend item container
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item'); // Use your .legend-item class

    // Create the color indicator
    const colorIndicator = document.createElement('div');
    colorIndicator.classList.add('legend-color'); // Use your .legend-color class
    colorIndicator.style.backgroundColor = dataset.borderColor;

    // Create the text block for the dataset name
    const textBlock = document.createElement('span');
    textBlock.textContent = dataset.label;

    // Append the color indicator and text block to the legend item
    legendItem.appendChild(colorIndicator);
    legendItem.appendChild(textBlock);

    legendItem.style.cursor = 'pointer';
    legendItem.onclick = function() {
        // Toggle dataset visibility on click
        const chartDataset = myChart.data.datasets[index];
        chartDataset.hidden = !chartDataset.hidden;
        legendItem.classList.toggle('is-disabled');

        myChart.update();
    };

    // Append the legend item to the legend container
    legendContainer.appendChild(legendItem);
});
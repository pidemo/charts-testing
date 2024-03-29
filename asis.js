// Chart.js Script (by Pierre)
Chart.defaults.plugins.legend.display = false;

const fontColor = '#ffffff';

const ctx = document.getElementById('chart');

const itemsData = Array.from(document.querySelectorAll('.values')).map(p => JSON.parse(p.textContent));
const labels = Object.keys(itemsData[0].Data).sort(); // Assuming all items have the same dates, get them sorted

const datasets = itemsData.map(item => ({
        label: item.Metadata.Name,
        borderColor: item.Metadata.Color,
        pointBackgroundColor: item.Metadata.Color,
        data: labels.map(label => ({
            x: label,
            y: item.Data[label].value,
            change: item.Data[label].change
        })),
        fill: false,
}));

// change background color
const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

const config = {
    type: 'line',
    //data,
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        plugins : {
        		customCanvasBackgroundColor: {
                color: '#404c45',
              },
            tooltip: {
                enabled: true,
                position: 'nearest',
                backgroundColor: '#fff',
                titleColor: '#000',
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyColor: '#000',
                bodyFont: {
                    size: 12,
                },
                borderColor: '#666',
                borderWidth: 1,
                cornerRadius: 4,
                displayColors: true,
                boxWidth: 10,
                boxHeight: 10,
                usePointStyle: true,
                // Custom function for tooltip labels
                callbacks: {
                    title: function(tooltipItems) {
                        // Customize the title
                        return tooltipItems[0].label;
                    },
                    label: function(context) {
                        // Customize the label
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        const dataset = context.dataset;
                        const dataPoint = dataset.data[context.dataIndex];
                        const change = dataPoint.change;
                        return `${label}: ${value} | Change : ${change >= 0 ? '+' : ''}${(change * 100).toFixed(2)}%`;
                    }
                },
                // Adjust font color of tooltips
                bodyFontColor: '#ffffff'
            }
        },
        interaction:{
            mode: 'index'
        },
        scales: {
            x: {
                ticks: {
                    color: fontColor // Changes the tick labels' color on the x-axis
                },
                grid: {
                    // color: 'rgba(255,255,255,0.1)' // Changes the x-axis grid line color
                },
                title: {
                    display: false,
                    text: 'Your X Axis Title',
                    color: fontColor // Change the axis title text color if needed
                }
            },
            y: {
                ticks: {
                    color: fontColor // Changes the tick labels' color on the x-axis
                },
                grid: {
                    color: 'rgba(255,255,255,0.1)' // Changes the x-axis grid line color
                },
                title: {
                    display: false,
                    text: 'Your X Axis Title',
                    color: fontColor // Change the axis title text color if needed
                },
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
    },
    plugins: [plugin],
    legend: {
        display: false, // Disable the default legend
    }
};


const myChart = new Chart(ctx, config);

// custom legend setup
const legendContainer = document.getElementById('legend-wrapper');
datasets.forEach((dataset, index) => {
    // Create the legend item container
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item');

    // Create the color indicator
    const colorIndicator = document.createElement('div');
    colorIndicator.classList.add('legend-color');
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
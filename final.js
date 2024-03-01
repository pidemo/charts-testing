
// Chart.js Setup - by Pierre

// Centralized Style and Configuration Settings
const chartStyles = {
	// chart settings
    fontColor: '#ffffff', // Set font color for the chart labels
    chartBackground: '#404c45', // Set background color for the chart canvas
    gridLineColor: 'rgba(255,255,255,0.1)', // Set grid lines color
    // tooltips settings
    tooltipFontColor: '#ffffff', // Set font color for the chart tooltips
    changeLabel: 'Change: ', // Set text label for change in tooltip
    changeSeparator: ' | ', // Set separator between rebased value and change label in tooltip
    // animation settings
    animationThreshold: 0.1, // Defines how much of the chart section has to be scrolled into viewport to trigger chart. 0.1 = 10%
    // Axis Labels
    labelsFontFamily: "'Roboto Mono', monospace",
    labelsFontSize: 16,
    labelsFontWeight: 400, // Make sure to specify a weight that has been imported to the site
    labelsLineHeight: 1.2,
    // Y Axis Label
    yDisplayLabel: true,
    yLabelText: 'Rebased @ 100',
    yPaddingTop: 0,
    yPaddingRight: 0,
    yPaddingBottom: 20,
    yPaddingLeft: 0,
    // X Axis Label
    xDisplayLabel: false,
    xLabelText: '',
    xPaddingTop: 0,
    xPaddingRight: 0,
    xPaddingBottom: 0,
    xPaddingLeft: 0
};

// Chart.js Script
Chart.defaults.plugins.legend.display = false;

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
    pointRadius: 0
}));

// Custom Plugin for Background Color
const customCanvasBackgroundColor = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = chartStyles.chartBackground;
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
};

// Chart Configuration
const config = {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
    		responsive: true,
        plugins: {
            tooltip: {
                enabled: true,
                position: 'nearest',
                usePointStyle: true,
                callbacks: {
                    title: tooltipItems => tooltipItems[0].raw.x,
                    label: context => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        const change = context.dataset.data[context.dataIndex].change;
                        return `${label}: ${value}${chartStyles.changeSeparator}${chartStyles.changeLabel}${change >= 0 ? '+' : ''}${(change * 100).toFixed(2)}%`;
                    }
                },
                bodyFontColor: chartStyles.tooltipFontColor
            }
        },
        interaction: {
            mode: 'index' // shows all 4 values instead of 1 in the tooltip
        },
        scales: {
            x: {
                type: 'time', // Use the 'time' scale type
                time: {
                    parser: 'yyyy-MM-dd', // Specify how your dates are parsed (if needed)
                    unit: 'month', // Specify the unit to be displayed
                    displayFormats: {
                        month: 'yyyy-MM', // Display format for the month unit
                    },
                },
                title: {
                    display: chartStyles.xDisplayLabel,
                    text: chartStyles.xLabelText.toUpperCase(),
                    color: chartStyles.fontColor,
                    font: {
                      family: chartStyles.labelsFontFamily,
                      size: chartStyles.labelsFontSize,
                      weight: chartStyles.labelsFontWeight,
                      lineHeight: chartStyles.labelsLineHeight,
                    },
                    padding: {
                        top: chartStyles.xPaddingTop, 
                        left: chartStyles.xPaddingLeft, 
                        right: chartStyles.xPaddingRight, 
                        bottom: chartStyles.xPaddingBottom
                    }
                },
                ticks: {
                    color: chartStyles.fontColor
                },
                grid: {
                    color: chartStyles.gridLineColor
                }
            },
            y: {
                title: {
                    display: chartStyles.yDisplayLabel,
                    text: chartStyles.yLabelText.toUpperCase(),
                    color: chartStyles.fontColor,
                    font: {
                      family: chartStyles.labelsFontFamily,
                      size: chartStyles.labelsFontSize,
                      weight: chartStyles.labelsFontWeight,
                      lineHeight: chartStyles.labelsLineHeight,
                    },
                    padding: {
                        top: chartStyles.yPaddingTop, 
                        left: chartStyles.yPaddingLeft, 
                        right: chartStyles.yPaddingRight, 
                        bottom: chartStyles.yPaddingBottom
                    }
                },
                ticks: {
                    color: chartStyles.fontColor
                },
                grid: {
                    color: chartStyles.gridLineColor
                }
            }
        }
    },
    plugins: [customCanvasBackgroundColor]
};


// Initialize the chart inside this function, which is called by the Intersection Observer
function initChart() {
    const myChart = new Chart(ctx, config);

    // Setup custom legend
    const legendContainer = document.getElementById('legend-wrapper');
    datasets.forEach((dataset, index) => {
        const legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');
        const colorIndicator = document.createElement('div');
        colorIndicator.classList.add('legend-color');
        colorIndicator.style.backgroundColor = dataset.borderColor;
        const textBlock = document.createElement('span');
        textBlock.textContent = dataset.label;
        legendItem.appendChild(colorIndicator);
        legendItem.appendChild(textBlock);
        legendItem.style.cursor = 'pointer';
        legendItem.onclick = function() {
            const chartDataset = myChart.data.datasets[index];
            chartDataset.hidden = !chartDataset.hidden;
            legendItem.classList.toggle('is-disabled');
            myChart.update();
        };
        legendContainer.appendChild(legendItem);
    });
}

// Intersection Observer to trigger chart initialization when the element is visible
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initChart(); // Initialize the chart when it becomes visible
            observer.unobserve(entry.target); // Stop observing the target once it's initialized
        }
    });
}, {
    root: null, // observes changes in the viewport
    threshold: chartStyles.animationThreshold // triggers when 10% of the target is visible
});

observer.observe(ctx); // Start observing the chart container
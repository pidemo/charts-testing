
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
    animationThreshold: 0.1 // Defines how much of the chart section has to be scrolled into viewport to trigger chart. 0.1 = 10%
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
        plugins: {
            tooltip: {
                enabled: true,
                position: 'nearest',
                usePointStyle: true,
                callbacks: {
                    title: tooltipItems => tooltipItems[0].label,
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
                ticks: {
                    color: chartStyles.fontColor
                },
                grid: {
                    color: chartStyles.gridLineColor
                }
            },
            y: {
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
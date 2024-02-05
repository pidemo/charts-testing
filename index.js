// Make webhook :
// https://hook.us1.make.com/juascp0jwebf88z4p4ixxm6x17jvjp9d

  
const totalMonths = 239;
  
function reformatData(data) {
    const monthlySeries = data["Monthly Time Series"];
    const reformattedArray = Object.entries(monthlySeries).map(([date, values]) => {
        return { date: date, close: values["4. close"] };
    });
    return reformattedArray;
}
	
const stocks = document.querySelector('#stocks');
const cmsData = reformatData(JSON.parse(stocks.querySelector('#data').innerText));

// Extracting an array of dates, and reverse order
const dates = cmsData.map(item => item.date).slice(0, totalMonths).reverse();

// Extracting an array of close values
const closeValues = cmsData.map(item => item.close);

// Converting values to numerical
const numericCloseValues = closeValues.map(value => parseFloat(value));
const selectedValues = numericCloseValues.slice(0, totalMonths).reverse();

// Drawingn graph
const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
      /*
      {
        label: 'Closing Valuation',
        data: numericCloseValues,
        borderWidth: 1
      }
      */
        ]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }
});

const newDataset = {
    label: "Test Name",
    data: numericCloseValues,
    borderWidth: 1
};
myChart.data.datasets.push(newDataset);
myChart.update();

/*
// 1. Select the list-wrapper element and its child items
const listWrapper = document.querySelector('.list-wrapper');
const items = listWrapper.querySelectorAll('div'); // Assuming each item is a direct child div

// 2. Loop through each item
items.forEach((item) => {
  const itemName = item.querySelector('.item-name').textContent; // Get the name
  const itemDataString = item.querySelector('.item-data').textContent; // Get the dataset string
  const itemData = JSON.parse(itemDataString); // Parse the JSON string to an object

  // 3. Create a new dataset object for the chart
  const newDataset = {
    label: itemName, // Use the item name as the label
    data: itemData, // Assuming the parsed JSON string is an array of data points
    borderWidth: 1,
    // You can also specify other properties like backgroundColor, borderColor, etc.
  };

  // Push the new dataset to the chart
  myChart.data.datasets.push(newDataset);
});

// 4. Update the chart to reflect the new datasets
myChart.update();
*/
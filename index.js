// Make webhook :
// https://hook.us1.make.com/juascp0jwebf88z4p4ixxm6x17jvjp9d

// PART 1 v1
/*
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
*/

// PART 1 V2
document.addEventListener('DOMContentLoaded', function() {
const totalMonths = 239;

function reformatData(data) {
    const monthlySeries = data["Monthly Time Series"];
    // Directly extract and convert dates and close values, and reverse the order if necessary
    let dates = [];
    let numericCloseValues = [];
    Object.entries(monthlySeries).forEach(([date, values], index) => {
        if (index < totalMonths) { // Limit to totalMonths from the start
            dates.push(date);
            numericCloseValues.push(parseFloat(values["4. close"]));
        }
    });
    // Since we're adding stocks in sequence, reverse here if we want the latest months first
    return { dates: dates.reverse(), closeValues: numericCloseValues.reverse() };
}

// get testing content
 const stocks = document.querySelector('#stocks');
 const cmsData = reformatData(JSON.parse(stocks.querySelector('#data').innerText));

// Now cmsData.dates and cmsData.closeValues already contain what you need
const dates = cmsData.dates;
const selectedValues = cmsData.closeValues; // Already numeric and reversed


// PART 2

// Drawingn graph
const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
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

// Now select the list-wrapper element and its child stocks
//const listWrapper = document.querySelectorAll('.list-wrapper');
const stockWrapper = document.querySelectorAll('.stock-wrapper'); // Assuming each item is a direct child div

console.log(stockWrapper);

// 2. Loop through each item
stockWrapper.forEach((item) => {
    const itemName = item.querySelector('.item-name').textContent; // Get the name
    const itemDataString = item.querySelector('.item-data').textContent; // Get the dataset string
    const itemData = reformatData(JSON.parse(itemDataString)); // Parse the JSON string to an object
    const itemDataValues = itemData.closeValues;
  
    // 3. Create a new dataset object for the chart
    const newDataset = {
      label: itemName, // Use the item name as the label
      data: itemDataValues, // Assuming the parsed JSON string is an array of data points
      borderWidth: 1,
      // You can also specify other properties like backgroundColor, borderColor, etc.
    };
  
    // Push the new dataset to the chart
    myChart.data.datasets.push(newDataset);
  });
  


// 4. Update the chart to reflect the new datasets
myChart.update();
});
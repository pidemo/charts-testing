// Make webhook :
// https://hook.us1.make.com/juascp0jwebf88z4p4ixxm6x17jvjp9d

// PART 1
// document.addEventListener('DOMContentLoaded', function() {
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


// PART 2 : Drawing graph
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
const stockWrapper = document.querySelectorAll('.stock-wrapper'); // Assuming each item is a direct child div

// 2. Loop through each item
stockWrapper.forEach((item) => {
    const itemName = item.querySelector('.item-name').textContent; // Get the name
    const itemDataString = item.querySelector('.item-data').textContent; // Get the dataset string
    const itemData = reformatData(JSON.parse(itemDataString)); // Parse the JSON string to an object
    const itemDataValues = itemData.closeValues;

    const monthsCount = itemData.dates.length;
    console.log(itemName, monthsCount);
  
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

myChart.update();
//});
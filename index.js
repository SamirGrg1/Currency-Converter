// const URL = `${url}=${fromCurr.value.toLowerCase()}%2C${toCurr.value.toLowerCase()}.json`;

const url = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_wkX41bo7SLCXb8xSXeQwck2p8V2FVfYy47VbvR8o";

// Select elements from the DOM
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        // Set default selections: USD for "from" and INR for "to"
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
  
    // Add event listener to update the flag when a currency is selected
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to fetch and update exchange rate
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    // Ensure a minimum amount of 1
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    
    // Fetch the latest exchange rates
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch exchange rates.");
        
        let data = await response.json();
        
        // Get the exchange rate for the selected currencies
        let fromRate = data.data[fromCurr.value.toUpperCase()];
        let toRate = data.data[toCurr.value.toUpperCase()];
        let rate = toRate / fromRate;

        // Calculate and display the converted amount
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate. Please try again.";
    }
};

// Function to update the flag image based on the selected currency
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  };
  
  btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
  });
  
  window.addEventListener("load", () => {
    updateExchangeRate();
  });

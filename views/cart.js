const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const subtotal = document.getElementById("subtotal");

quantity.addEventListener("change",(e) => {
    const value = price.value * e.target.value;
    subtotal.innerHTML = 
    `<span>${value}</span>`

});

// const value = e.target.value.toLowerCase();
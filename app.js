import express from "express";
import {engine} from "express-handlebars";
import morgan from "morgan";
import bodyParser from "body-parser";

import path from "path";
import { fileURLToPath } from "url";
import { resourceLimits } from "worker_threads";

// import mongoose from "mongoose";
// import productItems from "../controllers/productItems.js";

const customers = [
    {
        user_id: 1,
        name: "Sanny Hui",
        address: "ChinaChem Center",
        phone: "91813138"
    }
];

const products = [
    {
        product_id: 1,
        product_name: "Cat Tuna",
        product_image: "cat_food.png",
        price: 50,
    },
    {
        product_id: 2,
        product_name: "Dog Food",
        product_image: "dog_food.png",
        price: 60,
    },
    {
        product_id: 3,
        product_name: "Cat Food",
        product_image: "cat_food.png",
        price: 30,
    },
    {
        product_id: 4,
        product_name: "Cat Bed",
        product_image: "dog_food.png",
        price: 90,
    },
];

products.push(
    {
        product_id: 5,
        product_name: "Unknown",
        product_image: "cat_food.png",
        price: 45,
    }
)

let cart = [];
let history = [];
let invoice_number = 0;

const app = express();
const PORT = process.env.PORT || 3100;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const formidable = require('formidable');

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "resources/images")));

let today = new Date();
let hour = today.getHours();
let greeting = "Good Evening"

if (hour > 6 && hour < 12) {
    greeting = "Good Morning"
} else if (hour < 18) {
    greeting = "Good Afternoon"
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middleware should be put on top.

app.use(function(req, res, next) {
    console.log("Date", Date.now());
    console.log("Hour", hour)
    next(); // fall through
});

app.get("/", (req, res) => {
    res.render("index", {title: greeting});
});

app.get("/mission", (req, res) => {
    res.render("mission");
});

app.get("/product", (req, res) => {
    res.render("product", {products});
});

app.get("/clear", (req, res) => {
    cart = [];
    res.redirect("product");
});

app.get("/cart", (req, res) => {
    const sub = cart.price * cart.quantity;
    // subtotal = function (obj) {
    //     return {price} * {quantity}
    // }
    // const total = cart.reduce((sum, o) => sum + o.subtotal, 0);
    // console.log("Total", total);
    // cart[0].total = total;
    res.render("cart", {cart});
});

app.get("/checkout", (req, res) => {
    const total = cart.reduce((sum, o) => sum + o.subtotal, 0);
    console.log("Total", total);
    invoice_number += 1;
    console.log("invoice", invoice_number)
    const carta = [ ...cart ]
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
    const name = customers[0].name;
    const address = customers[0].address;
    const phone = customers[0].phone;
    history.push({
        invoice: invoice_number,
        name: name,
        address: address,
        phone: phone,
        date: date,
        items: carta,
        total: total,
    });
    history.forEach((hist) => {
        console.log("History record after checkout: ", hist)
    } );
    res.render("checkout", {total: {total}, cart: {cart}, invoice: {invoice_number}, date: {date}, name: {name}, address: {address}, phone: {phone}})
});

app.post("/update", (req, res) => {
    console.log("Product ID: ", req.body.id);
    console.log("Quantity: ", req.body.quantity);
    let cartItem = cart.findIndex(o => o.product_id == req.body.id);
    console.log("current index: ",cartItem);
    if (req.body.quantity == 0) {
        cart.splice(cartItem, 1);
    } else {
        cart[cartItem].quantity = parseInt(req.body.quantity);
        cart[cartItem].subtotal = parseInt(req.body.quantity) * cart[cartItem].price
    }
    // const total = cart.reduce((sum, o) => sum + o.subtotal, 0);
    // console.log("Total", total);
    // cart[0].total = total;
    res.render("cart", {cart});
});

app.post("/add", (req, res) => {
    console.log("Product ID: ", req.body.id);
    console.log("Quantity: ", req.body.quantity);
    res.render("product", {products});
    let cartItem = cart.findIndex(o => o.product_id == req.body.id);
    console.log("=", cartItem);
    if (cartItem > -1) {
        cart[cartItem].quantity += parseInt(req.body.quantity);
        cart[cartItem].subtotal += parseInt(req.body.quantity) * parseInt(req.body.price)
    } else {
        products.forEach((product) => {
            if (product.product_id == req.body.id) {
                console.log("Product price: ", product.price);
                let add_product = product;
                add_product.quantity = parseInt(req.body.quantity);
                add_product.subtotal = parseInt(req.body.quantity) * product.price;
                cart.push(add_product);
            };
        });
    };
})

app.get("/history/", (req, res) => {
    res.render("history", {history});
});

// Updating
app.get("/history/(:invoice)", (req, res) => {
    console.log("Invoice ?: ", req.params.invoice);
    history.forEach((hist) => {
        console.log("History record: ", hist)
    } );
    const history_invoice = history.find(hist => hist.invoice == req.params.invoice);
    // console.log("Invoice number: ", history_invoice);
    res.render("history_view", {invoice_item: history_invoice})
})
// End of update
// export const getEditIdeas = (req, res) => {
//      findOne() return single record.
//     Idea.findOne({_id: req.params.id}).lean().then((idea) => { // Cache
//         res.render("ideas/edit", {idea: idea}); 
//     });
// }

app.post("/ua_information", (req, res) => {
    let customer = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
    }
    // const message = "Updated"
    customers[0] = {...customer};
    customer.message = "Updated";
    console.log("Customer", customer)
    res.render("u_information", {customer})
});

app.get("/u_information", (req, res) => {
    const customer = customers[0];
    res.render("u_information", {customer})
});

app.post("/u_information_update", (req, res) => {
    let customer = {
        user_id: req.body.user_id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
    }
    // const message = "Updated"
    customers[0] = {...customer};
    customer.message = "Updated";
    console.log("Customer", customer)
    res.render("u_information", {customer})
});

app.get("/ua_information_list", (req, res) => {
    res.render("ua_information_list", {customers});
});

app.get("/ua_information/(:user_id)", (req, res) => {
    console.log("Invoice ?: ", req.params.customer);
    history.forEach((hist) => {
        console.log("History record: ", hist)
    } );
    const selected_customer = customers.find(cust => cust.user_id == req.params.user_id);
    // console.log("Invoice number: ", history_invoice);
    res.render("ua_information", {customer: selected_customer})
});

app.get("/ua_invoice_list/", (req, res) => {
    res.render("ua_invoice_list", {history});
});

app.get("/ua_invoice/(:invoice)", (req, res) => {
    // console.log("Invoice ?: ", req.params.invoice);
    // history.forEach((hist) => {
    //     console.log("History record: ", hist)
    // } );
    const history_invoice = history.find(hist => hist.invoice == req.params.invoice);
    res.render("ua_invoice", {invoice_item: history_invoice})
});

app.post("/ua_invoice_delete/(:invoice)",(req, res) => {
    const history_invoice = history.find(hist => hist.invoice == req.params.invoice);
    history.splice(history_invoice, 1);
    res.render("ua_invoice_list", {history});
});

app.post("/ua_invoice_edit/(:invoice)",(req, res) => {
    const history_invoice = history.find(hist => hist.invoice == req.params.invoice);
    console.log("1st item", req.body); // {quantity:['2', '1'], id: ['1', '3']}
    console.log("2nd item", history_invoice.items);
    if (Object.keys(req.body).length != 0) {
        let total_amount = 0;
        history_invoice.items.forEach((o, index) => {
            if (req.body.quantity[index] > 0) {
                o.quantity = parseInt(req.body.quantity[index]);
                o.subtotal = o.quantity * o.price;
                total_amount += o.subtotal;
            } else {
                history_invoice.items.splice(index, 1);
            }
        });
        history_invoice.total = total_amount;

        // const updated_data = req.body;
        // updated_data.id.forEach((o, index) => {
        //     let item = history_invoice.items.findIndex(p => p.product_id == o);
        //     let cartItem = cart.findIndex(o => o.product_id == req.body.id);
        //     if (item > -1) {
        //         if (updated_data.quantity[index] == 0) {
        //             history_invoice.items.splice(item, 1);
        //         } else {
        //             history_invoice.items[index].quantity = updated_data.quantity[index];
        //         };
        //     };
        // });
    };
    res.render("ua_invoice_edit", {invoice_item: history_invoice});
});

app.get("/items", (req, res) => {
    res.render("items", {products})
});

// items.handlebars use @index to return index value.
app.post("/items", (req, res) => {
    console.log(req.body);
    products[req.body.index].product = req.body.product;
    products[req.body.index].product_image = req.body.file;
    products[req.body.index].price = req.body.price;
    res.render("items", {products})
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(__dirname)
});
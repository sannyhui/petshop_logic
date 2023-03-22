import mongoose from "mongoose";
const {Schema} = mongoose;

const InvoiceItemSchema = new Schema ({
    quantity: {
        type: Number,
        required: true,
    },
    product_name: {
        type: String,
        required: true, // crash when required: true without any data.
    },
    price: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
});

// create a products folder
const InvoiceItem = mongoose.model("products", InvoiceItemSchema); 

export default InvoiceItem; // Export Idea class for main app to use.


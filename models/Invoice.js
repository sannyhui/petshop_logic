import mongoose from "mongoose";
const {Schema} = mongoose;

const InvoiceSchema = new Schema ({
    user_id: {
        type: mongoose.Types.ObjectId, // ObjectId = UID
        required: true,
    },
    invoice_no: {
        type: Number,
        required: true,
    },
    name: {
        type: String, // first_name + last_name
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    items: {
        type: InvoiceItem,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
});

// create an invoices folder
const Invoice = mongoose.model("invoices", InvoiceSchema); 

export default Invoice; // Export Idea class for main app to use.


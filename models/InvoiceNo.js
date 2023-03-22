import mongoose from "mongoose";
const {Schema} = mongoose;

const InvoiceNoSchema = new Schema ({
    customer_id: {
        type: mongoose.Types.ObjectId, // ObjectId = UID
        // required: true,
    },
    start_date_time: {
        type: Date,
        required: true,
    },
    end_date_time: {
        type: Date,
    },
    total: {
        type: Number,
        required: true,
    },
});

// create an invoices folder
const InvoiceNo = mongoose.model("invoices", InvoiceNoSchema); 

export default InvoiceNo; // Export Idea class for main app to use.


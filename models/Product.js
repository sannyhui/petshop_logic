import mongoose from "mongoose";
const {Schema} = mongoose;

const ProductSchema = new Schema ({
    category: {
        type: String,
        required: true,
    },
    product_name: {
        type: String,
        required: false, // crash when required: true without any data.
    },
    price: {
        type: Number,
        required: true,
    },
    product_image: {
        type: String,
        required: false,
    },
});

// create a products folder
const Product = mongoose.model("products", ProductSchema); 

export default Product; // Export Idea class for main app to use.


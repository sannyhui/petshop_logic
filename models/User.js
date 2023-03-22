import mongoose from "mongoose";
const {Schema} = mongoose;

const UserSchema = new Schema( {
    last_name: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    email_address: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    delivery_address: {
        type: String,
        required: false,
    },
    member_level: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    birthday: {
        type: String,
        required: false,
    },
    role: {
        type: Number,
        required: false,
    }
});

// Create a users folder
const User = mongoose.model("users", UserSchema);
export default User;
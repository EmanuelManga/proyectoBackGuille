import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import monsoosePaginate from "mongoose-paginate-v2";

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        max: 100,
    },
    lastName: {
        type: String,
        required: true,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },

    pass: {
        type: String,
        required: true,
        max: 100,
    },

    isAdmin: {
        type: Boolean,
        required: true,
    },
    role: {
        type: String,
        max: 100,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        required: true,
    },
    last_login: {
        type: Date,
        required: true,
        default: Date.now,
    },
    documents: [
        {
            name: {
                type: String,
                required: true,
            },
            reference: {
                type: String,
                required: true,
            },
        },
    ],
});
schema.plugin(monsoosePaginate);
export const UserModel = model("users", schema);

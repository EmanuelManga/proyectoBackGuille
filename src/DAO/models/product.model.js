import { Schema, model } from "mongoose";
import monsoosePaginate from "mongoose-paginate-v2";

const schema = new Schema({
    title: {
        type: String,
        required: true,
        max: 100,
    },
    description: {
        type: String,
        required: true,
        max: 300,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    category: {
        type: String,
        required: true,
        max: 100,
    },
});
schema.plugin(monsoosePaginate);

export const ProductModel = model("product", schema);

import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// const productSchema = new Schema({
//     productId: {
//         type: String,
//         required: false,
//         default: null,
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         default: null,
//     },
// });

// const schema = new Schema({
//     products: {
//         type: [productSchema],
//         required: false,
//         _id: false,
//         default: null,
//     },
// });

const productSchema = new Schema({
    productId: {
        type: String,
        required: true,
        default: null,
    },
    quantity: {
        type: Number,
        required: true,
        default: null,
    },
});

const schema = new Schema({
    products: {
        type: [productSchema],
        required: false,
        _id: false,
        default: null,
        validate: {
            validator: function (products) {
                const productIds = products.map((product) => product.productId);
                return new Set(productIds).size === productIds.length;
            },
            message: "Duplicate productIds are not allowed within the same document.",
        },
    },
});

schema.plugin(mongoosePaginate);

export const CartModel = model("carts", schema);

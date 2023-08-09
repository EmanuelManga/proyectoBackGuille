import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
            _id: false,
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", unique: true },
            quantity: { type: Number },
        },
    ],
});

export const CartModel = model("carts", cartSchema);

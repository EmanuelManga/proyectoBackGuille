import mongoose, { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    products: [
        {
            _id: false,
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    code: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
        max: 100,
    },
});

export const TicketModel = model("ticket", ticketSchema);

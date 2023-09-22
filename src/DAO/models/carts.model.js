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

cartSchema.pre("save", function (next) {
    this.products = this.products.filter((product) => product.quantity > 0);
    next();
});

// cartSchema.pre("findOneAndUpdate", function (next) {
//     const update = this.getUpdate();
//     if (update.$set && update.$set["products.$[].quantity"] === 0) {
//         this.update({}, { $pull: { products: { quantity: 0 } } });
//     }
//     next();
// });

// cartSchema.post("findOneAndUpdateSubtract", async function (doc) {
//     const cart = await this.model.findOne({ _id: doc._id });
//     cart.products = cart.products.filter((product) => product.quantity > 0);
//     await cart.save();
// });

export const CartModel = model("carts", cartSchema);

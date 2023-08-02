import { CartModel } from "../models/carts.model.js";

export class CartDao {
    async find(obj) {
        const orders = await CartModel.find(obj);

        return orders;
    }

    async findById(id) {
        const orders = await CartModel.findById(id);

        return orders;
    }

    async findOne(id) {
        const order = await CartModel.findOne({ _id: id });

        return order;
    }

    async findOneAndUpdate(_id, productId) {
        const order = await CartModel.findOneAndUpdate(
            {
                _id: _id,
                "products.productId": productId,
            },
            {
                $inc: { "products.$.quantity": 1 },
            }
        );

        return order;
    }

    async create(order) {
        const result = await CartModel.create(order);

        return result;
    }
    async insertMany(array) {
        const result = await CartModel.insertMany(array);

        return result;
    }

    async updateOne(id, order) {
        const result = await CartModel.updateOne({ _id: id }, { $set: order });

        return result;
    }
    async deleteOne(id_mongo) {
        const result = await CartModel.deleteOne({ _id: id_mongo });

        return result;
    }

    async findOneAndUpdateByQuantity(_id, productId, quantity) {
        const order = await CartModel.findOneAndUpdate(
            {
                _id: _id,
                "products.productId": productId,
            },
            {
                $set: { "products.$.quantity": quantity },
            }
        );

        return order;
    }

    async findOneAndUpdateRemove(_id, productId) {
        const order = await CartModel.findOneAndUpdate({ _id: _id }, { $pull: { products: { productId: productId } } });

        return order;
    }
}

// export const Cart = new CartDAO();

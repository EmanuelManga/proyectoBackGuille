import { ChatModel } from "../models/chat.model.js";

export class ChatDao {
    async find(obj) {
        const orders = await ChatModel.find(obj);

        return orders;
    }

    async findById(id) {
        const orders = await ChatModel.findById(id);

        return orders;
    }

    async findOne(id) {
        const order = await ChatModel.findOne({ _id: id });

        return order;
    }

    async findFirstone() {
        const primerRegistro = await ChatModel.findOne().lean();

        return primerRegistro;
    }

    // async findOneAndUpdate(_id, productId) {
    //     const order = await ChatModel.findOneAndUpdate(
    //         {
    //             _id: _id,
    //             "products.productId": productId,
    //         },
    //         {
    //             $inc: { "products.$.quantity": 1 },
    //         }
    //     );

    //     return order;
    // }

    async create(order) {
        const result = await ChatModel.create(order);

        return result;
    }
    async insertMany(array) {
        const result = await ChatModel.insertMany(array);

        return result;
    }

    async updateOne(id, order) {
        const result = await ChatModel.updateOne({ _id: id }, { $set: order });

        return result;
    }
    async deleteOne(id_mongo) {
        const result = await ChatModel.deleteOne({ _id: id_mongo });

        return result;
    }
}

// export const Cart = new CartDAO();

import { TicketModel } from "../models/ticket.model.js";

export class TicketDao {
    async find(obj) {
        const orders = await TicketModel.find(obj);

        return orders;
    }

    async findById(id) {
        const orders = await TicketModel.findById(id);

        return orders;
    }

    async findOne(id) {
        const order = await TicketModel.findOne({ _id: id });

        return order;
    }

    // async findOneAndUpdate(_id, productId, newProduct) {
    //     const order = await TicketModel.findOneAndUpdate(
    //         {
    //             _id: _id,
    //             "products.productId": productId,
    //         },
    //         { $push: { products: newProduct }, }
    //     );

    //     return order;
    // }

    async create(order) {
        const result = await TicketModel.create(order);

        return result;
    }
    async insertMany(array) {
        const result = await TicketModel.insertMany(array);

        return result;
    }

    async updateOne(id, order) {
        const result = await TicketModel.updateOne({ _id: id }, { $set: order });

        return result;
    }
    async deleteOne(id_mongo) {
        const result = await TicketModel.deleteOne({ _id: id_mongo });

        return result;
    }
}

// export const Cart = new CartDAO();

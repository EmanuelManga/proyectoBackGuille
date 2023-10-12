import { UserModel } from "../models/users.model.js";

export class UserDao {
    async find(obj) {
        const orders = await UserModel.find(obj);

        return orders;
    }

    async findById(id) {
        const orders = await UserModel.findById(id);

        return orders;
    }

    async findOne(obj) {
        const order = await UserModel.findOne(obj);

        return order;
    }

    async findOneAndUpdate(_id, productId) {
        const order = await UserModel.findOneAndUpdate(
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
        const result = await UserModel.create(order);

        return result;
    }
    async insertMany(array) {
        const result = await UserModel.insertMany(array);

        return result;
    }

    async updateOne(id, order) {
        const result = await UserModel.updateOne({ _id: id }, { $set: order });

        return result;
    }
    async deleteOne(obj) {
        const result = await UserModel.deleteOne(obj);

        return result;
    }

    async updateLastLogin(id) {
        const result = await UserModel.updateOne({ _id: id }, { $set: { last_login: new Date() } });
        return result;
    }

    async deleteMany(obj) {
        const result = await UserModel.deleteMany(obj);
        return result;
    }
}

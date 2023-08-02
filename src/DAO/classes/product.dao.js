import { ProductModel } from "../models/product.model.js";

export class ProductDao {
    async find(obj) {
        const orders = await ProductModel.find(obj);

        return orders;
    }

    async findById(id) {
        const orders = await ProductModel.findById(id);

        return orders;
    }

    async findOne(id) {
        const order = await ProductModel.findOne({ _id: id });

        return order;
    }

    async findOneAndUpdate(_id, productId) {
        const order = await ProductModel.findOneAndUpdate(
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

    async reducerStockId(_id, cantidadARestar) {
        const order = await ProductModel.findOneAndUpdate({ _id }, { $inc: { stock: -cantidadARestar } });

        return order;
    }

    async create(order) {
        const result = await ProductModel.create(order);

        return result;
    }
    async insertMany(array) {
        const result = await ProductModel.insertMany(array);

        return result;
    }

    async updateOne(id, order) {
        const result = await ProductModel.updateOne({ _id: id }, { $set: order });

        return result;
    }
    async deleteOne(id_mongo) {
        const result = await ProductModel.deleteOne({ _id: id_mongo });

        return result;
    }
    async paginate(busqueda, limit, page, query, sort) {
        !query ? (query = "stock") : null;

        const result = await ProductModel.paginate(busqueda, { limit: limit || 10, page: page || 1, sort: { [query]: sort || 1 } });

        return result;
    }
}

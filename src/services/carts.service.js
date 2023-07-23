import mongoose from "mongoose";
import { CartModel } from "../DAO/models/carts.model.js";
import { ProductModel } from "../DAO/models/product.model.js";

export class CartsService {
    validateUser(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const products = await CartModel.find({});
        return products;
    }

    async getById(id) {
        try {
            let id_mongo = null;
            if (typeof id === "string") {
                id_mongo = new mongoose.Types.ObjectId(id);
            } else {
                id_mongo = id;
            }
            const realProduct = await CartModel.findById(id_mongo);
            if (!realProduct) throw new Error("cart not found");
            // console.log("realProduct", realProduct);
            return realProduct;
        } catch (error) {
            console.error("Error retrieving cart:", error.message);
            // Maneja el error de acuerdo a tus necesidades (por ejemplo, retornar null, lanzar otro error personalizado, etc.)
            return null;
        }
    }

    async createOne() {
        try {
            const cartsCreated = await CartModel.create({});
            return cartsCreated;
        } catch (error) {
            console.error("Error al crear el nuevo elemento:", error);
            return error;
        }
    }

    async createMany(array) {
        array.forEach((element) => {
            this.validateUser(element.title, element.description, element.price, element.thumbnail, element.code, element.stock, element.status, element.category);
        });
        const productCreated = await CartModel.insertMany(array);
        return productCreated;
    }

    async deletedOne(_id) {
        const deleted = await CartModel.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, products) {
        console.log("_id, products", _id, products);
        if (!_id) throw new Error("invalid _id");
        const cart = await CartModel.findById(_id); // Obtener el documento del carrito por su _id
        if (!cart) throw new Error("cart not found");
        const realProduct = await ProductModel.findOne({ _id: products.productId });
        if (!realProduct) throw new Error("product not found");

        // console.log("realProduct", realProduct);
        let id = new mongoose.Types.ObjectId(products.productId);
        const existingProduct = await CartModel.findOneAndUpdate(
            {
                _id: _id,
                "products.productId": products.productId,
            },
            {
                $inc: { "products.$.quantity": 1 },
            }
        );
        console.log("existingProduct", existingProduct);
        if (!existingProduct) {
            cart.products.push({ productId: id, quantity: 1 });
        }
        // Guardar los cambios en la base de datos
        const updatedCart = await cart.save();
        return updatedCart;
    }

    async deleteProduct(_id, productId) {
        try {
            // Convertir los valores a ObjectId
            const docId = new mongoose.Types.ObjectId(_id);
            const prodId = new mongoose.Types.ObjectId(productId);

            // Encontrar y actualizar el documento
            const result = await CartModel.updateOne({ _id: docId }, { $pull: { products: { productId: prodId } } });
            console.log("resultado", result);
            if (result.nModified === 0) {
                console.log("No se encontró el producto en la lista.");
                return null;
            } else {
                const cart = await CartModel.findById(_id);
                console.log("cart", cart);
                console.log("Producto eliminado exitosamente.");
                return cart;
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return null;
        }
    }
}

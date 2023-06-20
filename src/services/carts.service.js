import { CartModel } from "../DAO/models/carts.model.js";
import { ProductModel } from "../DAO/models/product.model.js";
import { UserModel } from "../DAO/models/users.model.js";
import mongoose from "mongoose";

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
            const realProduct = await CartModel.findById(id);
            if (!realProduct) throw new Error("cart not found");
            console.log("realProduct", realProduct);
            return realProduct;
        } catch (error) {
            console.error("Error retrieving cart:", error.message);
            // Maneja el error de acuerdo a tus necesidades (por ejemplo, retornar null, lanzar otro error personalizado, etc.)
            return null;
        }
    }

    // async createOne() {
    //     try {
    //         const products = await CartModel.find({ products: { $size: 0 } });
    //         console.log(products);
    //         if (products.length !== 0) {
    //             try {
    //                 let productsParsed = JSON.parse(JSON.stringify(products));

    //                 for (let i = 0; i < productsParsed.length; i++) {
    //                     const element = productsParsed[i];
    //                     const deleted = await CartModel.deleteOne({ _id: element._id });
    //                     console.log(`Documento eliminado: ${deleted}`);
    //                 }
    //             } catch (error) {
    //                 console.error("Error al eliminar los documentos:", error);
    //             }
    //         }
    //         const cartsCreated = await CartModel.create({});
    //         return cartsCreated;
    //     } catch (error) {
    //         console.error("Error al crear el nuevo elemento:", error);
    //     }
    // }
    async createOne(_id) {
        try {
            if (!_id) throw new Error("invalid _id");
            const user = await UserModel.findById(_id);
            if (!user) throw new Error("user not found");
            const cart = await CartModel.findById(_id);
            if (!cart) {
                const cartsCreated = await CartModel.create({ _id });
                return { cartsCreated, status: true };
            }
            return { cart, status: true };
        } catch (error) {
            console.error("Error al crear el nuevo elemento:", error);
            return { status: false };
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
}

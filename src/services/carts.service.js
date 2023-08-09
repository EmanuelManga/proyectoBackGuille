import mongoose from "mongoose";
import { CartDao } from "../DAO/classes/carts.dao.js";
import { ProductDao } from "../DAO/classes/product.dao.js";
import CustomError from "../error/custom-error.js";
import EErros from "../error/list-error.js";
import { getCartById, getProductById } from "../error/message-error.js";
import { ProductService } from "./product.services.js";
import { UserService } from "./users.service.js";

const userService = new UserService();
const Cart = new CartDao();
const productService = new ProductService();
const Product = new ProductDao();

export class CartsService {
    validateUser(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const products = await Cart.find({});
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
            const realProduct = await Cart.findById(id_mongo);
            if (!realProduct) throw new Error("cart not found");
            // console.log("realProduct", realProduct);
            return realProduct;
        } catch (error) {
            console.error("Error retrieving cart:", error.message);
            // Maneja el error de acuerdo a tus necesidades (por ejemplo, retornar null, lanzar otro error personalizado, etc.)
            return error;
        }
    }

    async createOne() {
        try {
            const cartsCreated = await Cart.create({});
            return cartsCreated;
        } catch (error) {
            console.error("Error al crear el nuevo elemento:", error);
            throw error;
        }
    }

    async createMany(array) {
        array.forEach((element) => {
            this.validateUser(element.title, element.description, element.price, element.thumbnail, element.code, element.stock, element.status, element.category);
        });
        const productCreated = await Cart.insertMany(array);
        return productCreated;
    }

    async deletedOne(id) {
        let id_mongo = null;
        if (typeof id === "string") {
            id_mongo = new mongoose.Types.ObjectId(id);
        } else {
            id_mongo = id;
        }
        try {
            const deleted = await Cart.deleteOne(id_mongo);
            return deleted;
        } catch (error) {
            throw error;
        }
    }

    async updateOne(_id, products) {
        // console.log("_id, products", _id, products);
        try {
            if (!_id) throw new Error("invalid _id");
            const cart = await Cart.findById(_id); // Obtener el documento del carrito por su _id
            // if (!cart) throw new Error("cart not found");
            if (!cart) {
                CustomError.createError({
                    name: "Cart error",
                    cause: getCartById(_id),
                    message: "Error trying to add item in cart",
                    code: EErros.CART_ID_ERROR,
                });
            }
            try {
                const realProduct = await Product.findOne(products.productId);
            } catch (error) {
                CustomError.createError({
                    name: "Product error",
                    cause: getProductById(_id),
                    message: "Error trying to find product",
                    code: EErros.PRODUCT_ERROR,
                });
            }

            let id = new mongoose.Types.ObjectId(products.productId);
            const existingProduct = await Cart.findOneAndUpdate(_id, products.productId);
            // console.log("existingProduct", existingProduct);
            if (!existingProduct) {
                cart.products.push({ productId: id, quantity: 1 });
            }
            // Guardar los cambios en la base de datos
            const updatedCart = await cart.save();
            const result = await Cart.findOne(_id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(_id, productId) {
        try {
            // Convertir los valores a ObjectId
            const docId = new mongoose.Types.ObjectId(_id);
            const prodId = new mongoose.Types.ObjectId(productId);

            // Encontrar y actualizar el documento
            const result = await Cart.updateOne(docId, { products: { productId: prodId } });
            // console.log("resultado", result);
            if (result.nModified === 0) {
                console.log("No se encontró el producto en la lista.");
                return null;
            } else {
                const cart = await Cart.findById(_id);
                // console.log("cart", cart);
                console.log("Producto eliminado exitosamente.");
                return cart;
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return null;
        }
    }

    async getCartRender(email) {
        try {
            const user = await userService.getByEmail(email);
            const cid = user.cart;
            const name = user.firstName;
            let product = await this.getById(cid);
            let response = await productService.getProductInfo(product);
            return { response, name, cartId: user.cart };
        } catch (error) {
            throw error;
        }
    }

    async deleteByProductId(email, pid) {
        try {
            const user = await userService.getByEmail(email);
            const cid = user.cart;
            let productos = await this.deleteProduct(cid, pid);
            return { productos, cid };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async removeByProductId(email, pid) {
        try {
            const user = await userService.getByEmail(email);
            const cid = user.cart;
            let productos = await Cart.findOneAndUpdateRemove(cid, pid);
            return { productos, cid };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async addProductToCart(email, pid) {
        try {
            const user = await userService.getByEmail(email);
            const cid = user.cart;
            const productAdd = await this.updateOne(cid, { productId: pid });
            return productAdd;
        } catch (error) {
            throw error;
        }
    }
}

export const cartsService = new CartsService();

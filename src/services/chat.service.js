import mongoose from "mongoose";
import { ChatDao } from "../DAO/classes/chat.dao.js";
import { UserService } from "./users.service.js";

const Chat = new ChatDao();
const userService = new UserService();

export class ChatService {
    validateUser(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const mensajes = await Chat.find({});
        return mensajes;
    }
    async findFirstone() {
        const mensajes = await Chat.findFirstone();
        return mensajes;
    }

    // async getById(id) {
    //     try {
    //         let id_mongo = null;
    //         if (typeof id === "string") {
    //             id_mongo = new mongoose.Types.ObjectId(id);
    //         } else {
    //             id_mongo = id;
    //         }
    //         const realProduct = await Chat.findById(id_mongo);
    //         if (!realProduct) throw new Error("cart not found");
    //         // console.log("realProduct", realProduct);
    //         return realProduct;
    //     } catch (error) {
    //         console.error("Error retrieving cart:", error.message);
    //         return null;
    //     }
    // }

    async createOne() {
        try {
            const chatCreated = await Chat.create({});
            return chatCreated;
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

    async addMessage(email, message) {
        try {
            if (!message) {
                throw new Error("Mensaje requerido");
            }
            const user = await userService.getByEmail(email);
            const userId = user._id;
            let chat = await this.findFirstone();
            if (!chat) {
                chat = await this.createOne();
            }
            chat.mensajes.push({ userId, message });
            console.log("mensaje", chat);
            Chat.updateOne(chat._id, chat);
            return chat;
        } catch (error) {
            throw error;
        }
    }

    // async deletedOne(id) {
    //     let id_mongo = null;
    //     if (typeof id === "string") {
    //         id_mongo = new mongoose.Types.ObjectId(id);
    //     } else {
    //         id_mongo = id;
    //     }
    //     try {
    //         const deleted = await Cart.deleteOne(id_mongo);
    //         return deleted;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async updateOne(_id, products) {
    //     console.log("_id, products", _id, products);
    //     if (!_id) throw new Error("invalid _id");
    //     const cart = await Cart.findById(_id); // Obtener el documento del carrito por su _id
    //     if (!cart) throw new Error("cart not found");
    //     const realProduct = await Product.findOne(products.productId);
    //     if (!realProduct) throw new Error("product not found");

    //     // console.log("realProduct", realProduct);
    //     let id = new mongoose.Types.ObjectId(products.productId);
    //     const existingProduct = await Cart.findOneAndUpdate(_id, products.productId);
    //     console.log("existingProduct", existingProduct);
    //     if (!existingProduct) {
    //         cart.products.push({ productId: id, quantity: 1 });
    //     }
    //     // Guardar los cambios en la base de datos
    //     const updatedCart = await cart.save();
    //     return updatedCart;
    // }
}

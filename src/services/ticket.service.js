import dotenv from "dotenv";
import mongoose from "mongoose";
import { TicketDao } from "../DAO/classes/ticket.dao.js";
import { UserService } from "./users.service.js";
import { CartDao } from "../DAO/classes/carts.dao.js";
import { ProductDao } from "../DAO/classes/product.dao.js";
import { ProductService } from "./product.services.js";
import { CartsService } from "./carts.service.js";
import { EmailService } from "./email.service.js";
dotenv.config();

// const User = new UserDao();
const Ticket = new TicketDao();
const User = new UserService();
const Cart = new CartsService();
const Product = new ProductService();

const ProductD = new ProductDao();
const CartD = new CartDao();

const Email = new EmailService();

export class TicketService {
    validateUser(products, purchase_datetime, code, amount, purchaser) {
        if (!products || !purchase_datetime || !code || !amount || !purchaser) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const tickets = await Ticket.find({});
        return tickets;
    }

    async getByEmail(purchaser) {
        try {
            const tickets = await Ticket.findOne({ purchaser });
            return tickets;
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener el usuario por correo electrónico:", error);
            throw error;
        }
    }
    async getById(id) {
        try {
            let id_mongo = null;
            if (typeof id === "string") {
                id_mongo = new mongoose.Types.ObjectId(id);
            } else {
                id_mongo = id;
            }
            const user = await Ticket.findOne({ _id: id_mongo });
            if (user) {
                return user;
            } else {
                throw new Error("No existe");
            }
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener ticket por id:", error);
            throw error;
        }
    }

    async createOne(ticket) {
        // this.validateUser(ticket);
        if (!ticket) {
            throw new Error("validation error: please complete ticket.");
        }
        const ticketCreated = await Ticket.create(ticket);
        return ticketCreated;
    }

    async deletedOne(_id) {
        const deleted = await Ticket.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, products, purchase_datetime, code, amount, purchaser) {
        if (!_id) throw new Error("invalid _id");
        this.validateUser(products, purchase_datetime, code, amount, purchaser);
        const ticketUptaded = await Ticket.updateOne(_id, { products, purchase_datetime, code, amount, purchaser });
        return ticketUptaded;
    }

    async creatTicket(email) {
        try {
            const user = await User.getByEmail(email);
            const cart = await Cart.getById(user.cart);
            const ticket = await this.loopProducts(cart, email);
            const ticketGenereted = await this.createOne(ticket);
            const sendEmail = await Email.sendEmail(user, ticketGenereted);
            // console.log("user", user);
            // console.log("cart", cart);
            console.log("ticketGenereted", ticketGenereted);
            return ticketGenereted;
        } catch (error) {
            throw error;
        }
    }

    async existsStock(productId, amount) {
        try {
            const product = await ProductD.findById(productId);
            // console.log("existsStock", product);
            if (product.stock >= amount) {
                return product;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    async loopProducts(cart, email) {
        try {
            const ticketObj = {
                amount: 0,
                purchaser: email,
            };
            let auxAmount = 0;
            let auxProduct = [];

            // Use `map` to create an array of promises
            const isValidPromises = cart.products.map(async (element) => {
                const isValid = await this.existsStock(element.productId, element.quantity);
                return { isValid, element };
            });

            // Wait for all promises to resolve using `Promise.all`
            const results = await Promise.all(isValidPromises);

            results.forEach(async ({ isValid, element }) => {
                if (isValid) {
                    auxAmount += isValid.price * element.quantity;
                    const obj = { productId: element.productId, quantity: element.quantity, price: isValid.price };
                    auxProduct.push(obj);
                    await Cart.removeByProductId(email, element.productId);
                    await ProductD.reducerStockId(element.productId, element.quantity);
                } else {
                    const stock = await ProductD.findById(element.productId);
                    console.log("stock", stock);
                    await CartD.findOneAndUpdateByQuantity(cart._id, element.productId, stock.stock);
                    // console.log("cart", cart);
                }
            });
            ticketObj.amount = auxAmount;
            ticketObj.products = auxProduct;
            // console.log("auxProduct", auxProduct);
            // console.log("loop", ticketObj);
            return ticketObj;
        } catch (error) {
            throw error;
        }
    }
}

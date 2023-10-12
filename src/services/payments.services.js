import { __dirname } from "../utils.js";
import { cartsService } from "./carts.service.js";
import { UserService } from "./users.service.js";
import { ProductService } from "./product.services.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const userService = new UserService();
const productsService = new ProductService();

export class PaymentsService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    #calculateOrderAmount = async (amount) => {
        return amount * 100;
    };

    createPaymentIntent = async (email) => {
        const getCurrent = await userService.getCurrent(email);
        const getCart = await cartsService.getById(getCurrent.cart);
        const response = await productsService.getProductInfo(getCart);

        // console.log("response", response);

        try {
            const stripeClient = this.stripe;
            const paymentIntent = await stripeClient.paymentIntents.create({
                amount: await this.#calculateOrderAmount(response.totalCost),
                currency: "usd",
                payment_method_types: ["card"],
            });

            return { clientSecret: paymentIntent.client_secret };
        } catch (error) {
            throw error;
        }
    };
}

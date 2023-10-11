import fs from "fs";
import { ChatDao } from "../DAO/classes/chat.dao.js";
import { ProductDao } from "../DAO/classes/product.dao.js";
import CustomError from "../error/custom-error.js";
import EErros from "../error/list-error.js";
import { errorId, generateProductErrorInfo, updateProductErrorId, updateProductErrorInfo } from "../error/message-error.js";
import { __dirname } from "../utils.js";
import { cartsService } from "./carts.service.js";
import { UserService } from "./users.service.js";
import Stripe from "stripe";

import dotenv from "dotenv";
dotenv.config();
// const CartS = new CartsService();

export default class PaymentsService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    createPaymentIntent = async (data) => {
        const paymentIntent = await this.stripe.paymentIntents.create(data);

        return paymentIntent;
    };
}

import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { uploader } from "../utils.js";
import { paymentsController } from "../controllers/payments.controller.js";

export const paymentsRouter = express.Router();

// paymentsRouter.post("/payment-intent", paymentsController.paymentIntent);

import stripe from "stripe";
import { UserService } from "../services/users.service.js";
import { CartsService } from "../services/carts.service.js";
import { ProductService } from "../services/product.services.js";

const stripeClient = stripe("sk_test_51NzeI7EwsblfmvmoSjxbyXqvvRLeO26QFv1elFszjFRx1SGMd5CbmKxcfwY6yBiTfkIk0vVVcFylQxHyBnQeDj6J00ecg9EPwW");

const userService = new UserService();
const cartsService = new CartsService();
const productsService = new ProductService();

const calculateOrderAmount = (amount) => {
    return amount * 100;
};

paymentsRouter.post("/payment-intent", async (req, res) => {
    const { items } = req.body;
    const email = req.session.email;
    const getCurrent = await userService.getCurrent(email);
    const getCart = await cartsService.getById(getCurrent.cart);
    const response = await productsService.getProductInfo(getCart);

    console.log("response", response);

    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: calculateOrderAmount(response.totalCost),
            currency: "usd",
            payment_method_types: ["card"],
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            // automatic_payment_methods: {
            //     enabled: true,
            // },
        });

        // res.send({
        //     clientSecret: paymentIntent.client_secret,
        // });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("error", error);
        res.status(500).send("Error al crear el PaymentIntent");
    }
});

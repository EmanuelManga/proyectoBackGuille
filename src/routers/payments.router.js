import express from "express";

import { PaymentsController } from "../controllers/payments.controller.js";
import { isUser } from "../middlewares/auth.js";

export const paymentsRouter = express.Router();

const paymentsController = new PaymentsController();

paymentsRouter.post("/payment-intent", isUser, paymentsController.paymentIntent);

paymentsRouter.get("/after-payment", isUser, paymentsController.afterPayment);

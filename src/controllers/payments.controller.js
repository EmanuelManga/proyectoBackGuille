import dotenv from "dotenv";
import { PaymentsService } from "../services/payments.services.js";
dotenv.config();

const paymentsService = new PaymentsService();

export class PaymentsController {
    async paymentIntent(req, res) {
        const email = req.session.email;
        try {
            const resutl = await paymentsService.createPaymentIntent(email);
            // console.log("result controller", resutl);
            return res.status(200).json(resutl);
        } catch (error) {
            console.log("error controller", error);
            return res.status(404).json({ status: "error", msg: `Error al generar key para Stripe`, data: { error } });
        }
        // const getPaymentKey =
    }

    async afterPayment(req, res) {
        const email = req.session.email;
        try {
            // const resutl = await paymentsService.createPaymentIntent(email);
            // console.log("result controller", resutl);
            return res.render("stripe", { isLogIn: true });
        } catch (error) {
            console.log("error controller", error);
            return res.status(404).json({ status: "error", msg: `Error al generar key para Stripe`, data: { error } });
        }
    }
}

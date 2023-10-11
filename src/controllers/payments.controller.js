import handleErrorResponse from "../middlewares/error.js";
import PaymentsService from "../services/payments.services.js";
import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";
import { __dirname } from "../utils.js";

class PaymentsController {
    async getProductByIdRender(req, res) {
        let pid = req.params.pid;

        try {
            let productos = await productService.getByIdResString(pid);
            return res.status(200).render("home", { productos });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: {} });
        }
    }
    async paymentIntent(req, res) {
        // const productRequest = req.query.id;
        const paymentIntentInfo = {
            amount: 10,
            currency: "usd",
        };

        const service = new PaymentsService();
        const result = await service.createPaymentIntent(paymentIntentInfo);

        console.log("result", result);
        res.status(200).send({ status: "success", payload: result });
    }
}

export const paymentsController = new PaymentsController();

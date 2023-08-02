import { TwilioService } from "../services/twilio.services.js";

const Twilio = new TwilioService();

class TwilioController {
    async sendSms(req, res) {
        // const email = req.session.email;
        try {
            const sms = await Twilio.sendSms();
            return res.status(200).json({ status: "success", msg: `Se envio el SMS con exito`, data: {} });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }
}

export const twilioController = new TwilioController();

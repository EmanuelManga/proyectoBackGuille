import dotenv from "dotenv";
dotenv.config();

import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class TwilioService {
    async sendSms() {
        try {
            const result = await client.messages.create({
                body: "Si el biza la solto, es porque la agarro",
                from: process.env.TWILIO_PHONE_NUMBER,
                to: "+541139163755",
            });
            return "succes";
        } catch (error) {
            throw error;
        }
    }
}

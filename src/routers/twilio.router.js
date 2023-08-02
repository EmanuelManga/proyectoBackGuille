import express from "express";
import { twilioController } from "../controllers/twilio.controller.js";

export const twilioRouter = express.Router();

// twilioRouter.get("/", ticketController.getAll);

twilioRouter.get("/", twilioController.sendSms);

// twilioRouter.get("/ticket", ticketController.generarTicket);

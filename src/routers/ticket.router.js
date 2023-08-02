import express from "express";
import { chatController } from "../controllers/chat.controller.js";
import { notAdmin } from "../middlewares/auth.js";
import { ticketController } from "../controllers/ticket.controller.js";

export const ticketRouter = express.Router();

// ticketRouter.get("/", ticketController.getAll);

ticketRouter.get("/", ticketController.creatTicket);

ticketRouter.get("/ticket", ticketController.generarTicket);

// chatRouter.post("/", cartController.crearteNewCart);

// chatRouter.put("/product/:pid", isUserAjax, cartController.addProductToCart);

// chatRouter.get("/:cid", cartController.getById);

// chatRouter.delete("/:pid", isUser, cartController.deleteByProductId);

import express from "express";
import { chatController } from "../controllers/chat.controller.js";
import { notAdmin } from "../middlewares/auth.js";

export const chatRouter = express.Router();

chatRouter.get("/", chatController.getFirstone);

chatRouter.post("/", notAdmin, chatController.addMessage);

// chatRouter.post("/", cartController.crearteNewCart);

// chatRouter.put("/product/:pid", isUserAjax, cartController.addProductToCart);

// chatRouter.get("/:cid", cartController.getById);

// chatRouter.delete("/:pid", isUser, cartController.deleteByProductId);

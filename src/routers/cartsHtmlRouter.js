import express from "express";

import { cartController } from "../controllers/carts.controller.js";
import { isUser } from "../middlewares/auth.js";

export const cartsHtmlRouter = express.Router();

cartsHtmlRouter.get("/", isUser, cartController.getCartRender);

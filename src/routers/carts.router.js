import express from "express";
import { cartController } from "../controllers/carts.controller.js";
import { isUser, isUserAjax } from "../middlewares/auth.js";

export const cartRouter = express.Router();

cartRouter.post("/", cartController.crearteNewCart);

cartRouter.put("/products/:pid", isUserAjax, cartController.addProductToCartReturnAll);

cartRouter.put("/add-product/:pid", isUserAjax, cartController.addProductToCart);

cartRouter.put("/subtract-product/:pid", isUserAjax, cartController.subtractProductToCart);

cartRouter.get("/:cid", cartController.getById);

cartRouter.delete("/:pid", isUser, cartController.deleteByProductId);

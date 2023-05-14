import express from "express";
import { cart } from "../CartManager.js";
import { producto } from "../ProductManager.js";

export const SocketRouter = express.Router();

SocketRouter.get("/", async (req, res) => {
    let productos = await producto.getProducts();
    // console.log(productos);
    return res.render("realTimeProducts", { productos });
    // return res.status(200).json({ status: "success", msg: `Se agrego el producto:${productos} al carrito`, data: productos });
});

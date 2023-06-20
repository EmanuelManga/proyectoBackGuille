import express from "express";
import { producto } from "../DAO/ProductManager.js";
import { CartsService } from "../services/carts.service.js";
import mongoose from "mongoose";

// const { ProductManager, producto } = await import("../utils/products.json");

export const cartRouter = express.Router();

const Service = new CartsService();

cartRouter.post("/", async (req, res) => {
    try {
        const { id } = req.body;
        const _id = new mongoose.Types.ObjectId(id);
        const productCreated = await Service.createOne(_id);
        console.log("productCreated", productCreated);
        console.log("req.session.email", req.session.email);
        if (!productCreated.status) {
            return res.status(401).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
        return res.status(201).json({
            status: "success",
            msg: "product created",
            data: productCreated,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const productAdd = await Service.updateOne(cid, { productId: pid });
        return res.status(201).json({
            status: "success",
            msg: "product created",
            data: productAdd,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

cartRouter.get("/:cid", async (req, res) => {
    let cartId = req.params.cid;
    let productos = await Service.getById(cartId);
    console.log("productos", productos);

    if (productos) {
        if (productos.products.length == 0) {
            return res.status(200).json({ status: "success", msg: `El carrito con ID:${cartId} no posee ningun producto`, data: productos.products });
        } else {
            return res.status(200).json({ status: "success", msg: `Productos del carrito con ID:${cartId}`, data: productos.products });
        }
    } else {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun carrito con el ID: ${cartId}`, data: {} });
    }
});

// cartRouter.post("/", async (req, res) => {
//     let carrito = await cart.addCart();
//     // console.log(productos);
//     // limit ? (productos = productos.slice(0, limit)) : productos;
//     return res.status(200).json({ status: "success", msg: "listado de productos", data: carrito });
// });

// cartRouter.post("/:cid/product/:pid", async (req, res) => {
//     let cartId = req.params.cid;
//     let productId = req.params.pid;
//     let productQuant = 1;
//     let product = await producto.getProductById(productId);
//     if (product.state) {
//         let carrito = await cart.addProductToCart(cartId, productId, productQuant);
//         return res.status(200).json({ status: "success", msg: `Se agrego el producto:${product.producto.title} al carrito`, data: carrito });
//     } else {
//         return res.status(400).json({ status: "success", msg: `No existe ningun producto con el id:${productId}`, data: {} });
//     }
// });

// cartRouter.get("/:cid", async (req, res) => {
//     let cartId = req.params.cid;
//     let productos = await Service.getById(cartId);
//     console.log("productos", productos);

//     if (productos.state) {
//         if (productos.isEmpty) {
//             return res.status(200).json({ status: "success", msg: `El carrito con ID:${cartId} no posee ningun producto`, data: productos.productos });
//         } else {
//             return res.status(200).json({ status: "success", msg: `Productos del carrito con ID:${cartId}`, data: productos.productos });
//         }
//     } else {
//         return res.status(404).json({ status: "error", msg: `No se encuentra ningun carrito con el ID: ${cartId}`, data: {} });
//     }
// });

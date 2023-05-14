import express from "express";
import { cart } from "../CartManager.js";
import { producto } from "../ProductManager.js";
// const { ProductManager, producto } = await import("../utils/products.json");

export const cartRouter = express.Router();

cartRouter.post("/", async (req, res) => {
    let carrito = await cart.addCart();
    // console.log(productos);
    // limit ? (productos = productos.slice(0, limit)) : productos;
    return res.status(200).json({ status: "success", msg: "listado de productos", data: carrito });
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let productQuant = 1;
    let product = await producto.getProductById(productId);
    if (product.state) {
        let carrito = await cart.addProductToCart(cartId, productId, productQuant);
        return res.status(200).json({ status: "success", msg: `Se agrego el producto:${product.producto.title} al carrito`, data: carrito });
    } else {
        return res.status(400).json({ status: "success", msg: `No existe ningun producto con el id:${productId}`, data: {} });
    }
});

cartRouter.get("/:cid", async (req, res) => {
    let cartId = req.params.cid;
    let productos = await cart.getProductsCartId(cartId);

    if (productos.state) {
        if (productos.isEmpty) {
            return res.status(200).json({ status: "success", msg: `El carrito con ID:${cartId} no posee ningun producto`, data: productos.productos });
        } else {
            return res.status(200).json({ status: "success", msg: `Productos del carrito con ID:${cartId}`, data: productos.productos });
        }
    } else {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun carrito con el ID: ${cartId}`, data: {} });
    }
});

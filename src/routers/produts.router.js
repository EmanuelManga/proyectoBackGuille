import express from "express";
import { producto } from "../ProductManager.js";
// const { ProductManager, producto } = await import("../utils/products.json");

export const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
    let limit = req.query.limit;
    let productos = await producto.getProducts();
    console.log(productos);
    limit ? (productos = productos.slice(0, limit)) : productos;
    return res.status(200).json({ status: "success", msg: "listado de productos", data: productos });
});

productRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let productos = await producto.getProducts();
    productos = productos.filter((x) => x.producId == pid);
    // productos.length == 0 ? productos.push({ error: `No se encuentra ningun producto con el id: ${pid}` }) : null;
    // res.json(productos);
    if (productos.length == 0) {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: productos });
    } else {
        return res.status(200).json({ status: "success", msg: `Producto con el id: ${pid}`, data: productos });
    }
});

productRouter.post("/", async (req, res) => {
    let obj = req.body;
    let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
    if (respuesta.state) {
        // let productos = await producto.getProducts();
        let productos = await producto.getProductById(respuesta.id);
        return res.status(200).json({ status: "success", msg: `El producto fue creado con exito`, data: productos.producto });
    } else {
        return res.status(404).json({ status: "error", msg: `el producto no se pudo crear`, data: {} });
    }
});

productRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let respuesta = await producto.deleteProduct(pid);
    if (respuesta.state) {
        return res.status(200).json({ status: "success", msg: `El producto fue eliminado con exito`, data: respuesta.product });
    } else {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${respuesta.product.id}`, data: {} });
    }
});

productRouter.put("/", async (req, res) => {
    let obj = req.body;
    let respuesta = await producto.updateProduct(obj.id, obj.product);
    let productos = await producto.getProductById(respuesta.id);
    if (respuesta.state) {
        return res.status(200).json({ status: "success", msg: `El producto fue actualizado con exito`, data: productos });
    } else {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${respuesta.id}`, data: {} });
    }
});

import express from "express";
// import { producto } from "../DAO/ProductManager.js";

export const productRouter = express.Router();

// productRouter.get("/", async (req, res) => {
//     let limit = req.query.limit;
//     let productos = await producto.getProducts();
//     console.log(productos);
//     limit ? (productos = productos.slice(0, limit)) : productos;
//     return res.status(200).json({ status: "success", msg: "listado de productos", data: productos });
// });

// productRouter.get("/:pid", async (req, res) => {
//     let pid = req.params.pid;
//     let productos = await producto.getProducts();
//     productos = productos.filter((x) => x.producId == pid);
//     if (productos.length == 0) {
//         return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: productos });
//     } else {
//         return res.status(200).json({ status: "success", msg: `Producto con el id: ${pid}`, data: productos });
//     }
// });

// productRouter.post("/", async (req, res) => {
//     let obj = req.body;
//     console.log("obj", obj);
//     let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
//     if (respuesta.state) {
//         let productos = await producto.getProductById(respuesta.id);
//         return res.status(200).json({ status: "success", msg: `El producto fue creado con exito`, data: productos.producto });
//     } else {
//         return res.status(404).json({ status: "error", msg: `el producto no se pudo crear`, data: {} });
//     }
// });

// productRouter.delete("/:pid", async (req, res) => {
//     let pid = req.params.pid;
//     let respuesta = await producto.deleteProduct(pid);
//     if (respuesta.state) {
//         return res.status(200).json({ status: "success", msg: `El producto fue eliminado con exito`, data: respuesta.product });
//     } else {
//         return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${respuesta.product.id}`, data: {} });
//     }
// });

// productRouter.put("/:pid", async (req, res) => {
//     let pid = req.params.pid;
//     let obj = req.body;
//     let respuesta = await producto.updateProduct(pid, obj.product);
//     let productos = await producto.getProductById(pid);
//     if (respuesta.state) {
//         return res.status(200).json({ status: "success", msg: `El producto fue actualizado con exito`, data: productos });
//     } else {
//         return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
//     }
// });

import { ProductService } from "../services/product.services.js";

const Service = new ProductService();

productRouter.get("/", async (req, res) => {
    try {
        const product = await Service.getAll();
        console.log(product);
        return res.status(200).json({
            status: "success",
            msg: "listado de productos",
            data: product,
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

productRouter.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const productCreated = await Service.createOne(title, description, price, thumbnail, code, stock, status, category);
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

productRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productDelete = await Service.deletedOne(id);
        //TODO LLAMAR A OTA FUNCION
        return res.status(200).json({
            status: "success",
            msg: "product deleted",
            data: {},
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

productRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        const product = await Service.updateOne(id, title, description, price, thumbnail, code, stock, status, category);

        //TODO LLAMAR A OTRA FUNCION
        return res.status(201).json({
            status: "success",
            msg: "user uptaded",
            data: { _id: id, title, description, price, thumbnail, code, stock, status, category },
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

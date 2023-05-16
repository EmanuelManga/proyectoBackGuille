import express from "express";
import { producto } from "../ProductManager.js";
import { uploader } from "../utils.js";
// const { ProductManager, producto } = await import("../utils/products.json");

export const productHtmlRouter = express.Router();

productHtmlRouter.get("/", async (req, res) => {
    let limit = req.query.limit;
    let productos = await producto.getProducts();
    // console.log(productos);
    limit ? (productos = productos.slice(0, limit)) : productos;
    return res.status(200).render("home", { productos });
});

productHtmlRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let productos = await producto.getProducts();
    productos = productos.filter((x) => x.producId == pid);
    // productos.length == 0 ? productos.push({ error: `No se encuentra ningun producto con el id: ${pid}` }) : null;
    // res.json(productos);
    if (productos.length == 0) {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: productos });
    } else {
        // return res.status(200).json({ status: "success", msg: `Producto con el id: ${pid}`, data: productos });
        return res.status(200).render("home", { productos });
    }
});

productHtmlRouter.post("/", uploader.single("thumbnail"), async (req, res) => {
    let obj = req.body;
    console.log("obj", obj);

    // Obtén la información del archivo cargado
    const file = req.file;
    if (!file) {
        return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
    }

    let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);

    if (respuesta.state) {
        let productos = await producto.getProductById(respuesta.id);
        return res.status(200).json({ status: "success", msg: "El producto fue creado con éxito", data: productos.producto });
    } else {
        return res.status(404).json({ status: "error", msg: "El producto no se pudo crear", data: {} });
    }
});

productHtmlRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let respuesta = await producto.deleteProduct(pid);
    if (respuesta.state) {
        let allProductos = await producto.getProducts();
        console.log("allProductos", allProductos);
        // return res.status(200).json({ status: "success", msg: `El producto fue eliminado con exito`, data: respuesta.product });
        return res.status(200).render("home", { productos: allProductos });
    } else {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${respuesta.product.id}`, data: {} });
    }
});

productHtmlRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let obj = req.body;
    let respuesta = await producto.updateProduct(pid, obj.product);
    let productos = await producto.getProductById(pid);
    if (respuesta.state) {
        // return res.status(200).json({ status: "success", msg: `El producto fue actualizado con exito`, data: productos });
        let allProductos = await producto.getProducts();
        return res.status(200).render("home", { productos: allProductos });
    } else {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
    }
});

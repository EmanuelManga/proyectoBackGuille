import express from "express";
import { uploader } from "../utils.js";
import fs from "fs";
import { __dirname, __filename } from "../utils.js";

import { ProductService } from "../services/product.services.js";
import { ProductModel } from "../DAO/models/product.model.js";
import { UserService } from "../services/users.service.js";

export const productHtmlRouter = express.Router();

const Service = new ProductService();
const UService = new UserService();

productHtmlRouter.get("/", async (req, res) => {
    const { page, limit, sort, query, querySerch } = req.query;
    const email = req.session.email;
    let name = null;
    let isLoged = false;
    const user = await UService.getByEmail(email);
    email ? ((isLoged = true), (name = user.firstName)) : (isLoged = false);
    // console.log("req.query", req.query);
    // console.log(page);
    let busqueda = {};
    querySerch && query ? (busqueda = { [query]: [querySerch] }) : null;
    console.log("busqueda", busqueda);
    const queryRes = await ProductModel.paginate(busqueda, { limit: limit || 10, page: page || 1, sort: { [query]: sort || 1 } });
    console.log("queryRes", queryRes);
    let products = JSON.parse(JSON.stringify(queryRes.docs));
    // console.log("products", products);
    const { docs, ...rest } = queryRes;
    let links = [];
    const endPoint = "/products?page=";
    for (let i = 1; i < rest.totalPages + 1; i++) {
        links.push({ label: i, href: endPoint + i });
    }

    rest.hasPrevPage ? (rest.prevLink = endPoint + rest.prevPage) : (rest.prevLink = null);
    rest.hasNextPage ? (rest.nextLink = endPoint + rest.nextPage) : (rest.nextLink = null);

    // console.log("links", links);
    // console.log("rest", rest);
    return res.status(200).render("home", { productos: products, pagination: rest, links, name, isLoged });
});

productHtmlRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let product = await Service.getById(pid);
    // let product = await Service.getAll();
    // product = product.filter((x) => x._id == pid);
    product = JSON.parse(JSON.stringify(product));
    if (product.length == 0) {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: product });
    } else {
        console.log(product);
        return res.status(200).render("home", { productos: product });
    }
});

productHtmlRouter.post("/", uploader.single("thumbnail"), async (req, res) => {
    let obj = req.body;
    console.log("obj", obj);

    const file = req.file;
    if (!file) {
        return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
    }

    // let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);
    console.log("carga", obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);
    let respuesta = await Service.createOne(obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);

    if (respuesta.state) {
        // let productos = await producto.getProductById(respuesta.id);
        let productos = await Service.getById(respuesta._id);
        console.log("byId", productos);
        return res.status(200).json({ status: "success", msg: "El producto fue creado con éxito", data: productos.producto });
    } else {
        return res.status(404).json({ status: "error", msg: "El producto no se pudo crear", data: {} });
    }
});

productHtmlRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let product = await Service.getById(pid);
    product = JSON.parse(JSON.stringify(product));
    const rutaArchivo = __dirname + "/public/pictures/" + product[0].thumbnail;
    let deleteProduct = await Service.deletedOne(pid);
    console.log(deleteProduct);
    if ((deleteProduct.deletedCount = 0)) {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
    } else {
        fs.unlink(rutaArchivo, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("No se pudo eliminar el archivo.");
            }
        });
        let allProductos = await Service.getAll();
        allProductos = JSON.parse(JSON.stringify(allProductos));
        console.log("allProductos", allProductos);
        return res.status(200).render("home", { productos: allProductos });
    }
});

productHtmlRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let obj = req.body;
    let product = await Service.updateOne(pid, obj.product);
    if (product) {
        let product = await Service.getAll();
        product = JSON.parse(JSON.stringify(product));
        return res.status(200).render("home", { productos: product });
    } else {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
    }
});

productHtmlRouter.get("/detalle/:pid", async (req, res) => {
    let pid = req.params.pid;
    let product = await Service.getById(pid);
    // let product = await Service.getAll();
    // product = product.filter((x) => x._id == pid);
    product = JSON.parse(JSON.stringify(product));
    if (product.length == 0) {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: product });
    } else {
        console.log(product);
        return res.status(200).render("detalle", { productos: product[0] });
    }
});

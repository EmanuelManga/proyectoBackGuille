import express from "express";
import { uploader } from "../utils.js";
import fs from "fs";
import { __dirname, __filename } from "../utils.js";

import { CartsService } from "../services/carts.service.js";
import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";
import { isUser } from "../middlewares/auth.js";

export const cartsHtmlRouter = express.Router();

const Service = new CartsService();
const PtService = new ProductService();
const UService = new UserService();

cartsHtmlRouter.get("/", isUser, async (req, res) => {
    const email = req.session.email;
    const user = await UService.getByEmail(email);
    const cid = user.cart;
    const name = user.firstName;
    let product = await Service.getById(cid);
    // let product = await Service.getAll();
    // product = product.filter((x) => x._id == pid);
    product = JSON.parse(JSON.stringify(product));
    // product = quitarPrefijoId(product);

    console.log("product", product);
    let response = await getProductInfo(product);
    // console.log("response", response);
    response = JSON.parse(JSON.stringify(response));
    if (product.length == 0) {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${cid}`, data: product });
    } else {
        return res.status(200).render("cart", { productos: response, name: name, isLoged: true });
        // return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${cid}`, data: product });
    }
});

function quitarPrefijoId(objeto) {
    const nuevoObjeto = { ...objeto };
    nuevoObjeto.products = nuevoObjeto.products.map((product) => {
        const nuevoProduct = { ...product };
        nuevoProduct.productId = nuevoProduct.productId.split("=")[1];
        return nuevoProduct;
    });
    return nuevoObjeto;
}

async function getProductInfo(product) {
    const response = [];

    for (const ele of product.products) {
        let getProduct = await PtService.getById(ele.productId);
        getProduct = JSON.parse(JSON.stringify(getProduct));
        getProduct[0].quantity = ele.quantity;
        getProduct[0].total = ele.quantity * getProduct[0].price;
        // console.log("getProduct", getProduct);
        response.push(getProduct[0]);
    }

    return response;
}

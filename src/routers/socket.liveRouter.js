import express from "express";
import { ProductModel } from "../DAO/models/product.model.js";
import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";

export const SocketRouter = express.Router();

const Service = new ProductService();

const UService = new UserService();

// SocketRouter.get("/", async (req, res) => {
//     let productos = await Service.getAll();
//     productos = JSON.parse(JSON.stringify(productos));
//     return res.render("realTimeProducts", { productos });
//     // return res.status(200).json({ status: "success", msg: `Se agrego el producto:${productos} al carrito`, data: productos });
// });

SocketRouter.get("/", async (req, res) => {
    const { page, limit, sort, query, querySerch } = req.query;
    const email = req.session.email;
    let name = null;
    let isLoged = false;
    const user = await UService.getByEmail(email);
    email ? ((isLoged = true), (name = user.firstName)) : (isLoged = false);

    let busqueda = {};
    querySerch && query ? (busqueda = { [query]: [querySerch] }) : null;

    const queryRes = await ProductModel.paginate(busqueda, { limit: limit || 10, page: page || 1, sort: { [query]: sort || 1 } });
    // console.log("queryRes", queryRes);
    let products = JSON.parse(JSON.stringify(queryRes.docs));
    // console.log("products", products);
    const { docs, ...rest } = queryRes;
    let links = [];
    for (let i = 1; i < rest.totalPages + 1; i++) {
        links.push({ label: i, href: "http://localhost:8080/realtimeproducts?page=" + i });
    }
    // console.log("links", links);
    // console.log("rest", rest);
    // return res.status(200).render("home", { productos: products, pagination: rest, links });
    return res.render("realTimeProducts", { productos: products, pagination: rest, links, name: name, isLoged });
    // return res.status(200).json({ status: "success", msg: `Se agrego el producto:${productos} al carrito`, data: productos });
});

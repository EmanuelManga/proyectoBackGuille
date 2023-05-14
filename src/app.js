import express from "express";
import { productRouter } from "./routers/produts.router.js";
import { cartRouter } from "./routers/carts.router.js";
import { SocketRouter } from "./routers/socket.liveRouter.js";
import { productHtmlRouter } from "./routers/productHtmlRouter.js";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";

import { producto } from "./ProductManager.js";

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log("se abrio un canal de soket" + socket.id);

    socket.emit("msg_back_to_front", {
        msg: "Cliente conectado",
    });

    socket.on("POST", async (data) => {
        // console.log(JSON.stringify(data));
        // console.log("obj", data);
        let option = data.metodo;
        let obj = data.producto;
        // console.log("obj", obj);
        // console.log("option", option);
        let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
        console.log("respuesta", respuesta);
        // let productos = await producto.getProducts();
        if (respuesta.state) {
            let productoNew = await producto.getProductById(respuesta.id);
            socket.emit("response-post", {
                msg: productoNew,
            });
        } else {
            socket.emit("response-post-error", {
                msg: { status: "error", msg: `el producto no se pudo crear`, data: {} },
            });
        }
    });

    socket.on("DELETE", async (data) => {
        let id = data.producto;
        console.log("delete id ", id);
        let respuesta = await producto.deleteProduct(id);
        if (respuesta.state) {
            socket.emit("response-delete", {
                msg: id,
            });
        } else {
            socket.emit("response-delete-error", {
                msg: { status: "error", msg: `No Existe un producto con ID: ${id}`, data: {} },
            });
        }
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

//Rutas: API REST CON JSON
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

//Rutas: HTML RENDER SERVER SIDE
app.use("/products", productHtmlRouter);

//Rutas: SOCKETS
app.use("/realtimeproducts", SocketRouter);

app.get("/*", async (req, res) => {
    return res.status(404).json({ status: "error", msg: "no encontrado", data: {} });
});

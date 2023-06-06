import express from "express";
import { productRouter } from "./routers/produts.router.js";
import { cartRouter } from "./routers/carts.router.js";
import { SocketRouter } from "./routers/socket.liveRouter.js";
import { productHtmlRouter } from "./routers/productHtmlRouter.js";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { uploader } from "./utils.js";

import webSocket from "./routers/webSocket.js";

// import { producto } from "./ProductManager.js";

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});

const socketServer = new Server(httpServer);
webSocket(socketServer);

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

app.post("/upload", uploader.single("thumbnail"), function (req, res, next) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
    } else {
        return res.status(200).json({ status: "success", msg: "Se ha cargado la imagen", file: file.filename });
    }
    // Aquí puedes acceder al archivo cargado utilizando req.file
    // Realiza las operaciones necesarias con el archivo
    // Puedes enviar una respuesta al cliente con el resultado de la carga
});

app.get("/*", async (req, res) => {
    return res.status(404).json({ status: "error", msg: "no encontrado", data: {} });
});

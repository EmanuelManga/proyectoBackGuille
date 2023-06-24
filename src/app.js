import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import passport from "passport";
import { productRouter } from "./routers/produts.router.js";
import { cartRouter } from "./routers/carts.router.js";
import { SocketRouter } from "./routers/socket.liveRouter.js";
import { productHtmlRouter } from "./routers/productHtmlRouter.js";
import { cartsHtmlRouter } from "./routers/cartsHtmlRouter.js";
import { usersRouter } from "./routers/users.router.js";
import { authRouter } from "./routers/auth.router.js";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname, connectMongo } from "./utils.js";
import { Server } from "socket.io";
import { uploader } from "./utils.js";

import webSocket from "./routers/webSocket.js";
import { stringMongoConnect, secretKey } from "../variables_globales.js";
import { iniPassport } from "./config/passport.config.js";
import { viewsRouter } from "./routers/views.router.js";
import { sessionsRouter } from "./routers/session.router.js";

// import { producto } from "./../DAO/ProductManager.js";

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});

connectMongo();

const socketServer = new Server(httpServer);
webSocket(socketServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        store: MongoStore.create({ mongoUrl: stringMongoConnect, ttl: 7200 }),
        secret: secretKey,
        resave: true,
        saveUninitialized: true,
    })
);

//TODO LO DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
//FIN TODO LO DE PASSPORT

//Rutas: API REST CON JSON
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

//Rutas: HTML RENDER SERVER SIDE
app.use("/", viewsRouter);
app.use("/products", productHtmlRouter);
app.use("/carts", cartsHtmlRouter);
app.use("/auth", authRouter);

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

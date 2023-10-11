import MongoStore from "connect-mongo";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import passport from "passport";
import path from "path";
import { Server } from "socket.io";
import { authRouter } from "./routers/auth.router.js";
import { cartRouter } from "./routers/carts.router.js";
import { cartsHtmlRouter } from "./routers/cartsHtmlRouter.js";
import { productHtmlRouter } from "./routers/productHtmlRouter.js";
import { productRouter } from "./routers/produts.router.js";
import { SocketRouter } from "./routers/socket.liveRouter.js";
import { usersRouter } from "./routers/users.router.js";
import { __dirname, connectMongo, uploader } from "./utils.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import dotenv from "dotenv";
import compression from "express-compression";
import { iniPassport } from "./config/passport.config.js";
import { chatRouter } from "./routers/chat.router.js";
import { mockingproductsRouter } from "./routers/mockingproducts.router.js";
import { sessionsRouter } from "./routers/session.router.js";
import { ticketRouter } from "./routers/ticket.router.js";
import { twilioRouter } from "./routers/twilio.router.js";
import { viewsRouter } from "./routers/views.router.js";
import webSocket from "./routers/webSocket.js";
import { paymentsRouter } from "./routers/payments.router.js";

dotenv.config();
// import { producto } from "./../DAO/ProductManager.js";

const app = express();
const port = 8080;

app.use(
    compression({
        brotli: { enabled: true, zlib: {} },
    })
);

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

// handlebars.registerPartial("nose", "{{> nose}}");

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        store: MongoStore.create({ mongoUrl: process.env.STRINGMONGOCONNECT, ttl: 7200 }),
        secret: process.env.SECRETKEY,
        resave: true,
        saveUninitialized: true,
    })
);

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion Fakevi´s",
            version: "1.0.0",
            description: "Documentacion del proyecto final del curso de backend de coderhouse",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};
console.log(__dirname);

const specs = swaggerJSDoc(swaggerOptions);

//TODO LO DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
//FIN TODO LO DE PASSPORT

// Rutas: SWAGGER
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Rutas: MOCKING TEST CON JSON
app.use("/mockingproducts", mockingproductsRouter);

//Rutas: API REST CON JSON
app.use("/api/payments", paymentsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/sms", twilioRouter);

//Rutas: HTML RENDER SERVER SIDE
app.use("/", viewsRouter);
app.use("/products", productHtmlRouter);
app.use("/carts", cartsHtmlRouter);
app.use("/auth", authRouter);

app.use("/stripe", (req, res) => {
    res.render("stripe");
});

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

// app.use(errorHandler);

app.get("/*", async (req, res) => {
    return res.status(404).json({ status: "error", msg: "no encontrado", data: {} });
});

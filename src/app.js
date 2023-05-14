import express from "express";
import { productRouter } from "./routers/produts.router.js";
import { cartRouter } from "./routers/carts.router.js";
import { testSocketRouter } from "./routers/socket.liveRouter.js";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log("se abrio un canal de soket" + socket.id);
    setInterval(() => {
        socket.emit("msg_back_to_front", {
            msg: Date.now() + " hola desde el back al socket",
        });

        socket.broadcast.emit("msg_back_to_todos_menos_socket", {
            msg: "hola desde el back a todos menos el socket",
        });

        socketServer.emit("msg_back_todos", { msg: "hola desde el back a todos" });
    }, 2000);

    socket.on("msg_front_to_back", (data) => {
        console.log(JSON.stringify(data));
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

//Rutas: SOCKETS
app.use("/test-socket", testSocketRouter);

app.get("/*", async (req, res) => {
    return res.status(404).json({ status: "error", msg: "no encontrado", data: {} });
});

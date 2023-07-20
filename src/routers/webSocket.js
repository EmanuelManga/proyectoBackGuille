import fs from "fs";
import { CartsService } from "../services/carts.service.js";
import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";
import { __dirname } from "../utils.js";

import MongoStore from "connect-mongo";
import session from "express-session";

const Service = new ProductService();
const CService = new CartsService();
const UService = new UserService();

export default function webSocket(socketServer) {
    const sessionMiddleware = session({
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://EmanuelMangani:vDzXZKvv15S3O8O4@backendcoder.s3uy0ix.mongodb.net/?retryWrites=true&w=majority",
            ttl: 7200,
        }),
        secret: "un-re-secreto",
        resave: true,
        saveUninitialized: true,
    });

    socketServer.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    // export default (socketServer) => {
    socketServer.on("connection", (socket) => {
        console.log("se abrio un canal de soket" + socket.id);

        socket.emit("msg_back_to_front", {
            msg: "Cliente conectado",
        });

        socket.on("POST", async (data) => {
            let obj = data.producto;
            // console.log("obj", obj);
            // let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
            try {
                let respuesta = await Service.createOne(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
                console.log("respuesta", respuesta);
                // let productos = await producto.getProducts();
                let productoNew = await Service.getById(respuesta._id);
                console.log("productoNew", productoNew);
                socketServer.emit("response-post", {
                    msg: productoNew[0],
                });
                socket.emit("response-post-toast", {
                    msg: { msg: "success" },
                });
            } catch (error) {
                socket.emit("response-post-error", {
                    msg: {
                        status: "error",
                        msg: `el producto no se pudo crear`,
                        data: {},
                    },
                });
            }
        });

        socket.on("DELETE", async (data) => {
            let pid = data.producto;
            let product = await Service.getById(pid);
            product = JSON.parse(JSON.stringify(product));
            const rutaArchivo = __dirname + "/public/pictures/" + product[0].thumbnail;
            let deleteProduct = await Service.deletedOne(pid);
            console.log(deleteProduct);
            if ((deleteProduct.deletedCount = 0)) {
                socket.emit("response-delete-error", {
                    msg: { status: "error", msg: `No Existe un producto con ID: ${id}`, data: {} },
                });
            } else {
                fs.unlink(rutaArchivo, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("No se pudo eliminar el archivo.");
                    }
                });
                socketServer.emit("response-delete", {
                    msg: pid,
                });
                socket.emit("response-delete-toast", {
                    msg: { msg: "success" },
                });
            }
        });
        socket.on("PUT", async (data) => {
            console.log("PUT SOCKET", data);
            const { pid } = data;
            try {
                const email = socket.request.session.email;
                const user = await UService.getByEmail(email);
                const cid = user.cart;
                try {
                    console.log("email", email);
                    console.log("user", user);
                    console.log(" pid", pid);
                    console.log("cid", cid);
                    const productAdd = await CService.updateOne(cid, { productId: pid });

                    socket.emit("response-addCart-toast", {
                        msg: { msg: "success" },
                    });
                } catch (e) {
                    socket.emit("response-delete-error", {
                        msg: { status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} },
                    });
                }
            } catch (error) {
                socket.emit("response-addCart-error", {
                    msg: { status: "error", msg: `No se encuentra logeado`, data: {} },
                });
            }
        });
    });
}

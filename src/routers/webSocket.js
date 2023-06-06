import { producto } from "../ProductManager.js";

export default (socketServer) => {
    socketServer.on("connection", (socket) => {
        console.log("se abrio un canal de soket" + socket.id);

        socket.emit("msg_back_to_front", {
            msg: "Cliente conectado",
        });

        socket.on("POST", async (data) => {
            let obj = data.producto;

            let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
            console.log("respuesta", respuesta);
            // let productos = await producto.getProducts();
            if (respuesta.state) {
                let productoNew = await producto.getProductById(respuesta.id);
                socketServer.emit("response-post", {
                    msg: productoNew,
                });
                socket.emit("response-post-toast", {
                    msg: { msg: "success" },
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
                socketServer.emit("response-delete", {
                    msg: id,
                });
                socket.emit("response-delete-toast", {
                    msg: { msg: "success" },
                });
            } else {
                socket.emit("response-delete-error", {
                    msg: { status: "error", msg: `No Existe un producto con ID: ${id}`, data: {} },
                });
            }
        });
    });
};

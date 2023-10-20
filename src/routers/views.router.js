import express from "express";
import { viewController } from "../controllers/views.controller.js";
import { uploader, uploaderDocuments } from "../utils.js";
import { userController } from "../controllers/users.controller.js";
export const viewsRouter = express.Router();

viewsRouter.get("/", viewController.getMain);

viewsRouter.get("/login", viewController.getLogin);

viewsRouter.post("/upload", uploader.single("thumbnail"), function (req, res, next) {
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

viewsRouter.post("/upload-profile-picture", uploaderDocuments.single("file"), userController.profilePictureUpload);

// viewsRouter.post("/upload-profile-picture", uploaderDocuments.single("file"), function (req, res, next) {
//     const file = req.file;
//     if (!file) {
//         return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
//     } else {
//         return res.status(200).json({ status: "success", msg: "Se ha cargado la imagen", file: file.filename });
//         // return next();
//     }
// });

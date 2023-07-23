import express from "express";
import { uploader } from "../utils.js";
import { productController } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.js";

export const productHtmlRouter = express.Router();

productHtmlRouter.get("/", productController.getProductRender);

productHtmlRouter.get("/:pid", productController.getProductByIdRender);

productHtmlRouter.post("/", isAdmin, uploader.single("thumbnail"), productController.postProduct);

productHtmlRouter.delete("/:pid", isAdmin, productController.deleteProduct);

productHtmlRouter.put("/:pid", isAdmin, productController.putProduct);

productHtmlRouter.get("/detalle/:pid", productController.getDetalle);

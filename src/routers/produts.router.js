import express from "express";
import { productController } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.js";
import { uploader } from "../utils.js";

export const productRouter = express.Router();

productRouter.get("/", productController.getProductApi);

productRouter.post("/", isAdmin, uploader.single("thumbnail"), productController.postProductApi);

productRouter.delete("/:id", isAdmin, productController.deleteProductApi);

productRouter.put("/:id", isAdmin, productController.putProductApi);

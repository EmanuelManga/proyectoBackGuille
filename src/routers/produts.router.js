import express from "express";
import { ProductService } from "../services/product.services.js";
import { productController } from "../controllers/products.controller.js";
import { uploader } from "../utils.js";
import { isAdmin } from "../middlewares/auth.js";

export const productRouter = express.Router();

productRouter.get("/", productController.getProductApi);

productRouter.post("/", isAdmin, uploader.single("thumbnail"), productController.postProductApi);

productRouter.delete("/:id", isAdmin, productController.deleteProductApi);

productRouter.put("/:id", isAdmin, productController.putProductApi);

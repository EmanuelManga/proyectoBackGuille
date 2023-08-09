import express from "express";
import { mockingproductsController } from "../controllers/mockingproduct.controller.js";

export const mockingproductsRouter = express.Router();

mockingproductsRouter.get("/", mockingproductsController.getMockingProduct);

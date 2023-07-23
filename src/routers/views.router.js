import express from "express";
import { viewController } from "../controllers/views.controller.js";
export const viewsRouter = express.Router();

viewsRouter.get("/", viewController.getMain);

viewsRouter.get("/login", viewController.getLogin);

import express from "express";
import { socketController } from "../controllers/socket.controllers.js";

export const SocketRouter = express.Router();

SocketRouter.get("/", socketController.getAll);

import express from "express";
import { userController } from "../controllers/users.controller.js";
import { isAdmin } from "../middlewares/auth.js";
import { UserService } from "../services/users.service.js";

export const usersRouter = express.Router();

const Service = new UserService();

usersRouter.get("/", isAdmin, userController.getAll);

usersRouter.post("/", userController.postUser);

usersRouter.delete("/:id", isAdmin, userController.deleteUser);

usersRouter.put("/:id", isAdmin, userController.putUser);

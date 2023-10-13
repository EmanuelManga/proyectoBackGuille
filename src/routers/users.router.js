import express from "express";
import { userController } from "../controllers/users.controller.js";
import { isAdmin } from "../middlewares/auth.js";

export const usersRouter = express.Router();

usersRouter.get("/", isAdmin, userController.getAll);

usersRouter.post("/", userController.postUser);

usersRouter.delete("/:id", isAdmin, userController.deleteUser);

usersRouter.delete("/", isAdmin, userController.deleteUserInactives);

usersRouter.put("/:id", isAdmin, userController.putUser);

usersRouter.put("/:id/admin", isAdmin, userController.toggleIsAdmin);

usersRouter.put("/:id/role", isAdmin, userController.setRole);

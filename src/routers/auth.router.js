import express from "express";
import { isUser } from "../middlewares/auth.js";
import dotenv from "dotenv";
import { authController } from "../controllers/auth.controller.js";
dotenv.config();

export const authRouter = express.Router();

authRouter.get("/logout", isUser, authController.logout);

authRouter.get("/perfil", isUser, authController.getProfile);

authRouter.get("/login", authController.getLogin);

authRouter.post("/login", authController.postLogin);

authRouter.get("/register", authController.register);

authRouter.post("/register", authController.postRegister);

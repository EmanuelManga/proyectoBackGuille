import express from "express";
import dotenv from "dotenv";
import { isAdmin } from "../middlewares/auth.js";
import { adminController } from "../controllers/admin.controller.js";
dotenv.config();

export const adminRouter = express.Router();

adminRouter.get("/", isAdmin, adminController.getAllUsers);

import passport from "passport";
import express from "express";
import { UserService } from "../services/users.service.js";
import { sessionController } from "../controllers/session.controller.js";
export const sessionsRouter = express.Router();

sessionsRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), sessionController.gitCallBack);

sessionsRouter.get("/show", sessionController.showCurrent);

sessionsRouter.get("/current", sessionController.current);

sessionsRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

sessionsRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), sessionController.googleCallBack);

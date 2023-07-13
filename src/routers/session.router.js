import passport from "passport";
import express from "express";
import { UserService } from "../services/users.service.js";
export const sessionsRouter = express.Router();

const Service = new UserService();

sessionsRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    req.session.email = req.user.email;
    res.redirect("/realtimeproducts");
});

sessionsRouter.get("/show", (req, res) => {
    return res.send(JSON.stringify(req.session));
});

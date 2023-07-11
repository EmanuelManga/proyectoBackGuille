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

sessionsRouter.get("/current", async (req, res) => {
    // console.log("req.session.email", req.session.email);
    try {
        const email = req.session.email;
        const getUser = await Service.getByEmail(email);
        return res.status(201).json({
            status: "success",
            msg: "Current User",
            data: getUser,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

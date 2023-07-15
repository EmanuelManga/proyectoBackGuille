import express from "express";
import { UserModel } from "../DAO/models/users.model.js";
import { isAdmin, isUser } from "../middlewares/auth.js";
import { CartsService } from "../services/carts.service.js";
import { createHash, isValidPassword } from "../utils.js";
import { defaultRole } from "../../variables_globales.js";
import { CartModel } from "../DAO/models/carts.model.js";

export const authRouter = express.Router();

const CartService = new CartsService();

authRouter.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render("error", { error: "no se pudo cerrar su session" });
        }
        // return res.redirect("/auth/login");
        return res.status(201).json({});
    });
});

authRouter.get("/perfil", isUser, (req, res) => {
    const user = { email: req.session.email, isAdmin: req.session.isAdmin };
    return res.render("perfil", { user: user });
});

authRouter.get("/login", (req, res) => {
    return res.render("login", {});
});

authRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    console.log("email, pass", email, pass);
    if (!email || !pass) {
        return res.status(400).render("error", { error: "ponga su email y pass" });
    }
    const usarioEncontrado = await UserModel.findOne({ email: email });
    console.log("usarioEncontrado", usarioEncontrado);
    const isPasswordValid = isValidPassword(pass, usarioEncontrado.pass);
    // if (usarioEncontrado && usarioEncontrado.pass == pass) {
    if (usarioEncontrado && isPasswordValid) {
        req.session.email = usarioEncontrado.email;
        req.session.isAdmin = usarioEncontrado.isAdmin;

        const cart = await CartService.createOne(usarioEncontrado._id);
        return res.redirect("/realtimeproducts");
        // return res.status(201).json({
        //     status: "success",
        //     msg: "logeado con exito",
        //     data: { firstName: usarioEncontrado.firstName, lastName: usarioEncontrado.lastName },
        // });
    } else {
        // return res.status(401).render("error", { error: "email o pass estan mal" });
        return res.status(401).json({
            status: "error",
            msg: "error en el usuario o password",
        });
    }
});

authRouter.get("/register", (req, res) => {
    return res.render("register", {});
});

authRouter.post("/register", async (req, res) => {
    const { email, pass, firstName, lastName } = req.body;
    if (!email || !pass || !firstName || !lastName) {
        return res.status(400).render("error", { error: "ponga bien toooodoo cheee!!" });
    }
    try {
        const newCart = await CartService.createOne();
        console.log("newCart", newCart);
        const hashPass = createHash(pass);
        const user = await UserModel.create({ email: email, pass: hashPass, firstName: firstName, lastName: lastName, isAdmin: false, role: defaultRole, cart: newCart._id });
        req.session.email = email;
        req.session.isAdmin = false;
        // req.session.id = user._id;

        return res.redirect("/realtimeproducts");
    } catch (e) {
        console.log(e);
        return res.status(400).render("error", { error: "no se pudo crear el usuario. Intente con otro mail." });
    }
});

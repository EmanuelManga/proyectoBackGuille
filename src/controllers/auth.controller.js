import { authService } from "../services/auth.services.js";
import { CartsService } from "../services/carts.service.js";
import { SessionService } from "../services/session.services.js";
import { UserService } from "../services/users.service.js";

const userService = new UserService();
const cartService = new CartsService();

class AuthController {
    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).render("error", { error: "no se pudo cerrar su session" });
            }
            return res.status(201).json({});
        });
    }

    async getProfile(req, res) {
        const user = { email: req.session.email, isAdmin: req.session.isAdmin };
        return res.render("perfil", { user: user });
    }

    async getLogin(req, res) {
        return res.render("login", {});
    }

    async postLogin(req, res) {
        const { email, pass } = req.body;

        try {
            if (!email || !pass) {
                return res.status(400).render("error", { error: "ponga su email y pass" });
            }
            const usarioEncontrado = await userService.getByEmail(email);
            await authService.validPass(pass, usarioEncontrado, req);
            return res.redirect("/products");
        } catch (error) {
            return res.status(401).json({
                status: "error",
                msg: "error en el usuario o password",
            });
        }
    }

    async register(req, res) {
        return res.render("register", {});
    }

    async postRegister(req, res) {
        const { email, pass, firstName, lastName } = req.body;
        if (!email || !pass || !firstName || !lastName) {
            return res.status(400).render("error", { error: "ponga bien toooodoo cheee!!" });
        }
        try {
            const newCart = await cartService.createOne();
            const user = await userService.createOne(firstName, lastName, email, pass, false, process.env.DEFAULTROLE, newCart._id);
            req.session.email = email;
            req.session.isAdmin = false;
            // req.session.id = user._id;

            return res.redirect("/products");
        } catch (e) {
            console.log(e);
            return res.status(400).render("error", { error: "no se pudo crear el usuario. Intente con otro mail." });
        }
    }
}

export const authController = new AuthController();

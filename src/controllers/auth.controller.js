import { authService } from "../services/auth.services.js";

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
        return res.render("login", { isLogIn: true });
    }

    async postLogin(req, res) {
        const { email, pass } = req.body;

        try {
            await authService.isLoginOk(email, pass, req);

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

        try {
            // req.session.id = user._id;
            await authService.postRegister(email, pass, firstName, lastName, req);
            return res.redirect("/products");
        } catch (e) {
            console.log(e);
            return res.status(400).render("error", { error: "no se pudo crear el usuario. Intente con otro mail." });
        }
    }
}

export const authController = new AuthController();

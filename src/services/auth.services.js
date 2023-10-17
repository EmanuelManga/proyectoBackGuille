import { isValidPassword } from "../utils.js";
import { CartsService } from "./carts.service.js";
import { UserService } from "./users.service.js";

const userService = new UserService();
const cartService = new CartsService();

class AuthService {
    async validPass(pass, usuarioEncontrado, req) {
        try {
            const isPasswordValid = isValidPassword(pass, usuarioEncontrado.pass);
            if (usuarioEncontrado && isPasswordValid) {
                console.log("awdawda", pass, usuarioEncontrado);
                req.session.email = usuarioEncontrado.email;
                // req.session.isAdmin = usuarioEncontrado.role;
                if (usuarioEncontrado.role.toLowerCase() === "admin") {
                    req.session.isAdmin = true;
                } else {
                    req.session.isAdmin = false;
                }
                await userService.updateLastLogin(usuarioEncontrado._id);
            } else {
                throw new Error("Password incorrecto");
            }
        } catch (error) {
            throw error;
        }
    }

    async isLoginOk(email, pass, req) {
        const usuarioEncontrado = await userService.getByEmail(email);
        if (!email || !pass) {
            throw new Error("Email y Password son requeridas");
        }
        if (!usuarioEncontrado) {
            throw new Error("No existe un usuario con ese Email");
        }
        await this.validPass(pass, usuarioEncontrado, req);
    }

    async postRegister(email, pass, firstName, lastName, req) {
        if (!email || !pass || !firstName || !lastName) {
            throw new Error("Email, Password, Nombre y Apellido son requeridas");
        }
        try {
            const newCart = await cartService.createOne();
            const user = await userService.createOne(firstName, lastName, email, pass, false, process.env.DEFAULTROLE, newCart._id);
            req.session.email = email;
            req.session.isAdmin = false;
        } catch (error) {
            throw error;
        }
    }
}

export const authService = new AuthService();

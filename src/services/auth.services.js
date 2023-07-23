import { isValidPassword } from "../utils.js";
import { CartsService } from "./carts.service.js";

class AuthService {
    async validPass(pass, usarioEncontrado, req) {
        try {
            const isPasswordValid = isValidPassword(pass, usarioEncontrado.pass);
            if (usarioEncontrado && isPasswordValid) {
                req.session.email = usarioEncontrado.email;
                req.session.isAdmin = usarioEncontrado.isAdmin;
            }
        } catch (error) {
            return error;
        }
    }
}

export const authService = new AuthService();

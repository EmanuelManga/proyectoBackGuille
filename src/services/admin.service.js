import { CartDao } from "../DAO/classes/carts.dao.js";
import { ProductDao } from "../DAO/classes/product.dao.js";
import { ProductService } from "./product.services.js";
import { UserService } from "./users.service.js";

const userService = new UserService();
const Cart = new CartDao();
const productService = new ProductService();
const Product = new ProductDao();

export class AdminService {
    async getAll(email) {
        let name = null;
        let isLoged = false;

        const registedUsers = await userService.getAllRegisted();

        const user = await userService.getByEmail(email);
        console.log(user);
        email ? ((isLoged = true), (name = user.firstName)) : (isLoged = false);

        return { registedUsers, email, name, isLoged, idActual: user._id };
    }
}

export const adminService = new AdminService();

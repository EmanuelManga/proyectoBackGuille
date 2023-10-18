import handleErrorResponse from "../middlewares/error.js";
import { CartsService } from "../services/carts.service.js";
import { ProductService } from "../services/product.services.js";
import { TicketService } from "../services/ticket.service.js";
import { UserService } from "../services/users.service.js";
import { adminService } from "../services/admin.service.js";

class AdminController {
    async getAllUsers(req, res) {
        const email = req.session.email;
        const isAdmin = req.session.isAdmin;
        // console.log(email, isAdmin);
        try {
            const result = await adminService.getAll(email);
            // return res.json({ status: "success", msg: "Se ha cargado la imagen", file: result });
            return res.status(200).render("admin", { users: result.registedUsers, isLoged: result.isLoged, isAdmin, name: result.name, idActual: result.idActual });
            // return res.status(200).render("admin", { users: result, name: cart.name, isLoged: true, cartId: cart.cartId });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }

    async getFormCreate(req, res) {
        const email = req.session.email;
        const isAdmin = req.session.isAdmin;
        // console.log(email, isAdmin);
        try {
            const result = await adminService.getAllProducts(email);
            console.log("result", result.products);
            // return res.json({ status: "success", msg: "Se ha cargado la imagen", file: result });
            return res.status(200).render("formProduct", { products: result.products, isLoged: result.isLoged, isAdmin, name: result.name, idActual: result.idActual });
            // return res.status(200).render("admin", { users: result, name: cart.name, isLoged: true, cartId: cart.cartId });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }
}

export const adminController = new AdminController();

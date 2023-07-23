import { ProductService } from "../services/product.services.js";
import { SessionService } from "../services/session.services.js";
import { UserService } from "../services/users.service.js";

const sessionService = new SessionService();
const userService = new UserService();
const productService = new ProductService();

class SocketController {
    async getAll(req, res) {
        const { page, limit, sort, query, querySerch } = req.query;
        const email = req.session.email;
        let name = null;
        let isLoged = false;
        const endPoint = "/realtimeproducts?page=";
        let busqueda = {};
        try {
            const user = await userService.getByEmail(email);
            email ? ((isLoged = true), (name = user.firstName)) : (isLoged = false);

            querySerch && query ? (busqueda = productService.getSerchQuery(query, querySerch)) : null;

            const queryRes = await productService.getPaginate(busqueda, limit, page, query, sort);

            const products = await productService.getProduct(queryRes);

            const { docs, ...rest } = queryRes;

            const links = await productService.getLink(rest, endPoint);

            const pagination = await productService.getNextPrevLink(rest, endPoint);

            // console.log("links", links);
            // console.log("rest", rest);
            return res.status(200).render("home", { productos: products, pagination, links, name, isLoged });
        } catch (error) {
            return res.status(400).json({ status: "error", msg: "No se ha cargado la pagina", data: {} });
        }
    }
}

export const socketController = new SocketController();

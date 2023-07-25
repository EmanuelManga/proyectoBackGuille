import { UserService } from "../services/users.service.js";
import { ProductService } from "./product.services.js";

const userService = new UserService();
const productservice = new ProductService();

class SocketService {
    async getProductRender(email, query, querySerch, limit, page, sort) {
        let name = null;
        let isLoged = false;
        const endPoint = "/realtimeproducts?page=";
        let busqueda = {};
        try {
            const user = await userService.getByEmail(email);
            email ? ((isLoged = true), (name = user.firstName)) : (isLoged = false);

            querySerch && query ? (busqueda = productservice.getSerchQuery(query, querySerch)) : null;

            const queryRes = await productservice.getPaginate(busqueda, limit, page, query, sort);

            const products = await productservice.getProduct(queryRes);

            const { docs, ...rest } = queryRes;

            const links = await productservice.getLink(rest, endPoint);

            const pagination = await productservice.getNextPrevLink(rest, endPoint);

            return { pagination, links, products, name, isLoged };
        } catch (error) {
            throw error;
        }
    }
}

export const socketService = new SocketService();

import { ProductService } from "../services/product.services.js";

const productService = new ProductService();

class SocketController {
    async getAll(req, res) {
        const { page, limit, sort, query, querySerch } = req.query;
        const email = req.session.email;
        const isAdmin = req.session.isAdmin;
        try {
            const objRender = await productService.getProductRender(email, query, querySerch, limit, page, sort);
            // return res.status(200).render("realTimeProducts", { productos: objRender.products, pagination: objRender.pagination, links: objRender.links, name: objRender.name, isLoged: objRender.isLoged });
            return res.status(200).render("realTimeProducts", {
                productos: objRender.products,
                pagination: objRender.pagination,
                links: objRender.links,
                name: objRender.name,
                isLoged: objRender.isLoged,
                chat: objRender.chat,
                userIdActual: objRender.userId,
                isAdmin,
            });
        } catch (error) {
            return res.status(400).json({ status: "error", msg: "No se ha cargado la pagina", data: {} });
        }
    }
}

export const socketController = new SocketController();

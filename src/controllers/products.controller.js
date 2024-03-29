import handleErrorResponse from "../middlewares/error.js";
import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";
import { __dirname } from "../utils.js";

const userService = new UserService();
const productService = new ProductService();
class ProductController {
    async getProductRender(req, res) {
        const { page, limit, sort, query, querySerch } = req.query;
        const email = req.session.email;
        const isAdmin = req.session.isAdmin;
        try {
            const objRender = await productService.getProductRenderProduct(email, query, querySerch, limit, page, sort);
            // console.log("cart", objRender.cart);
            // req.logger.debug("Objeto:", objRender.products);
            // console.log("isLoged", objRender.isLoged);
            // home // cardProduct
            return res.status(200).render("cardProduct", {
                productos: objRender.products,
                pagination: objRender.pagination,
                links: objRender.links,
                name: objRender.name,
                isLoged: objRender.isLoged,
                chat: objRender.chat,
                userIdActual: objRender.userId,
                isAdmin,
                cart: objRender.cart,
                cartId: objRender.cartId,
            });
        } catch (error) {
            // console.log(error);
            req.logger.error(error);
            return res.status(400).json({ status: "error", msg: "No se ha cargado la pagina", data: { error } });
        }
    }

    async getProductByIdRender(req, res) {
        let pid = req.params.pid;

        try {
            let productos = await productService.getByIdResString(pid);
            return res.status(200).render("home", { productos });
        } catch (error) {
            req.logger.error(error);
            return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: {} });
        }
    }

    async postProduct(req, res) {
        let obj = req.body;
        const file = req.file;

        try {
            const productos = await productService.postProduct(obj, file);
            return res.status(200).json({ status: "success", msg: "El producto fue creado con éxito", data: productos.producto });
        } catch (error) {
            req.logger.error(error);
            return res.status(404).json({ status: "error", msg: "El producto no se pudo crear", data: {} });
        }
    }

    async deleteProduct(req, res) {
        let pid = req.params.pid;
        // let product = await Service.getById(pid);

        try {
            const productos = await productService.deleteProduct(pid);
            return res.status(200).render("home", { productos });
        } catch (error) {
            req.logger.error(error);
            return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
        }
    }

    async putProduct(req, res) {
        let pid = req.params.pid;
        let obj = req.body;
        try {
            const productos = await productService.putProduct(pid, obj);
            return res.status(200).render("home", { productos });
        } catch (error) {
            req.logger.error(error);
            return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
        }
    }

    async getDetalle(req, res) {
        let pid = req.params.pid;
        const email = req.session.email;
        try {
            const result = await productService.getDetalle(pid, email);
            return res.status(200).render("detalle", { productos: result.product[0], name: result.name, isLoged: result.isLoged, cartId: result.cartId, cart: result.cart });
        } catch (error) {
            req.logger.error(error);
            return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: {} });
        }
    }

    async getProductApi(req, res) {
        try {
            const product = await productService.getAll();
            // console.log(product);
            let test = { product, product, product, product, product, product };
            return res.status(200).json({
                status: "success",
                msg: "listado de productos",
                data: test,
            });
        } catch (error) {
            req.logger.error(error);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async postProductApi(req, res) {
        try {
            const file = req.file;
            const { title, description, price, code, stock, status, category } = req.body;

            const productCreated = await productService.postProductApi(title, description, price, file, code, stock, status, category);
            return res.status(201).json({
                status: "success",
                msg: "product created",
                data: productCreated,
            });
        } catch (error) {
            req.logger.error(error);
            console.log("Controller", error);
            handleErrorResponse(res, error);
        }
    }

    async deleteProductApi(req, res) {
        try {
            const { id } = req.params;
            await productService.deletedOne(id);
            return res.status(200).json({
                status: "success",
                msg: "product deleted",
                data: {},
            });
        } catch (error) {
            req.logger.error(error);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async putProductApi(req, res) {
        try {
            const { id } = req.params;
            const obj = req.body;

            const product = await productService.putProductApi(id, obj);
            return res.status(201).json({
                status: "success",
                msg: "user uptaded",
                data: product,
            });
        } catch (error) {
            req.logger.error(error);
            console.log("putProductApi", error);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
}

export const productController = new ProductController();

import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";

const userService = new UserService();
const productService = new ProductService();
class ProductController {
    async getProductRender(req, res) {
        const { page, limit, sort, query, querySerch } = req.query;
        const email = req.session.email;
        const isAdmin = req.session.isAdmin;
        try {
            const objRender = await productService.getProductRender(email, query, querySerch, limit, page, sort);
            return res.status(200).render("home", {
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

    async getProductByIdRender(req, res) {
        let pid = req.params.pid;

        try {
            let productos = await productService.getByIdResString(pid);
            return res.status(200).render("home", { productos });
        } catch (error) {
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
            return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
        }
    }

    async getDetalle(req, res) {
        let pid = req.params.pid;
        try {
            const product = await productService.getByIdResString(pid);
            return res.status(200).render("detalle", { productos: product[0] });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: {} });
        }
    }

    async getProductApi(req, res) {
        try {
            const product = await productService.getAll();
            // console.log(product);
            return res.status(200).json({
                status: "success",
                msg: "listado de productos",
                data: product,
            });
        } catch (e) {
            console.log(e);
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
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
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
        } catch (e) {
            console.log(e);
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
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
}

export const productController = new ProductController();

import { CartsService } from "../services/carts.service.js";
import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";

const cartsService = new CartsService();
const userService = new UserService();
const productService = new ProductService();
class ProductController {
    async getProductRender(req, res) {
        const { page, limit, sort, query, querySerch } = req.query;
        const email = req.session.email;
        let name = null;
        let isLoged = false;
        const endPoint = "/products?page=";
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
            if (!file) {
                return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
            }
            const respuesta = await productService.createOne(obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);
            let productos = await productService.getById(respuesta._id);
            return res.status(200).json({ status: "success", msg: "El producto fue creado con éxito", data: productos.producto });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: "El producto no se pudo crear", data: {} });
        }
    }

    async deleteProduct(req, res) {
        let pid = req.params.pid;
        // let product = await Service.getById(pid);

        try {
            let product = await productService.getByIdResString(pid);
            await productService.deletedOne(pid);

            try {
                await productService.deleteThumbnail(product);
                const productos = await productService.getAllString();
                return res.status(200).render("home", { productos });
            } catch (error) {
                res.status(500).send("No se pudo eliminar el archivo.");
            }
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
        }
    }

    async putProduct(req, res) {
        let pid = req.params.pid;
        let obj = req.body;
        try {
            await productService.updateOne(pid, obj.product);
            const productos = await productService.getAllString();
            return res.status(200).render("home", { productos });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
        }
    }

    async getDetalle(req, res) {
        let pid = req.params.pid;
        try {
            const product = await productService.getByIdResString(pid);
            console.log(product);
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
            if (!file) {
                return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
            }
            const productCreated = await productService.createOne(title, description, price, file.filename, code, stock, status, category);
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

            await productService.updateOne(id, obj);
            const product = await productService.getById(id);
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

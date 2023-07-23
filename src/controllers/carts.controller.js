import { CartsService } from "../services/carts.service.js";
import { ProductService } from "../services/product.services.js";
import { UserService } from "../services/users.service.js";

const cartsService = new CartsService();
const userService = new UserService();
const productService = new ProductService();
class CartsController {
    async getCartRender(req, res) {
        const email = req.session.email;

        try {
            const user = await userService.getByEmail(email);
            const cid = user.cart;
            const name = user.firstName;
            let product = await cartsService.getById(cid);
            let response = await productService.getProductInfo(product);

            return res.status(200).render("cart", { productos: response, name: name, isLoged: true });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }
    async crearteNewCart(req, res) {
        try {
            const cartCrated = await cartsService.createOne({});

            return res.status(201).json({
                status: "success",
                msg: "El carrito se creo correctamente",
                data: cartCrated,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "Hubo un error al crear el nuevo carrito",
                data: {},
            });
        }
    }

    async getById(req, res) {
        const cartId = req.params.cid;
        try {
            const productos = await cartsService.getById(cartId);

            return res.status(200).json({ status: "success", msg: `Productos del carrito con ID:${cartId}`, data: productos.products });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `No se encuentra ningun carrito con el ID: ${cartId}`, data: {} });
        }
    }

    async deleteByProductId(req, res) {
        const email = req.session.email;
        const { pid } = req.params;

        try {
            const user = await userService.getByEmail(email);
            const cid = user.cart;

            let productos = await cartsService.deleteProduct(cid, pid);

            return res.status(200).json({ status: "success", msg: `Productos del carrito con ID:${cid}`, data: productos.products });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }

    async addProductToCart(req, res) {
        const email = req.session.email;
        const { pid } = req.params;
        try {
            const user = await userService.getByEmail(email);
            const cid = user.cart;
            const productAdd = await cartsService.updateOne(cid, { productId: pid });
            return res.status(201).json({
                status: "success",
                msg: "Producto agregado al carrito con exito",
                data: productAdd,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
}

export const cartController = new CartsController();

import handleErrorResponse from "../middlewares/error.js";
import { CartsService } from "../services/carts.service.js";
import { ProductService } from "../services/product.services.js";
import { TicketService } from "../services/ticket.service.js";
import { UserService } from "../services/users.service.js";

const cartsService = new CartsService();
const userService = new UserService();
const productService = new ProductService();
const ticketService = new TicketService();

class CartsController {
    async getCartRender(req, res) {
        const email = req.session.email;
        try {
            const cart = await cartsService.getCartRender(email);
            return res.status(200).render("cart", { productos: cart.response, name: cart.name, isLoged: true, cartId: cart.cartId });
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
            const obj = await cartsService.deleteByProductId(email, pid);
            return res.status(200).json({ status: "success", msg: `Productos del carrito con ID:${obj.cid}`, data: obj.productos.products });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }

    async addProductToCartReturnAll(req, res) {
        const email = req.session.email;
        const { pid } = req.params;
        try {
            const productoAdded = await cartsService.addProductToCartReturnAll(email, pid);
            return res.status(201).json({
                status: "success",
                msg: "Producto agregado al carrito con exito",
                data: productoAdded,
            });
        } catch (error) {
            console.log(error);
            handleErrorResponse(res, error);
            // return res.status(500).json({
            //     status: "error",
            //     msg: "something went wrong :(",
            //     data: {},
            // });
        }
    }

    async addProductToCart(req, res) {
        const email = req.session.email;
        const { pid } = req.params;
        try {
            const productoAdded = await cartsService.addProductToCart(email, pid);
            return res.status(201).json({
                status: "success",
                msg: "Producto agregado al carrito con exito",
                data: productoAdded,
            });
        } catch (error) {
            console.log(error);
            handleErrorResponse(res, error);
            // return res.status(500).json({
            //     status: "error",
            //     msg: "something went wrong :(",
            //     data: {},
            // });
        }
    }

    async subtractProductToCart(req, res) {
        const email = req.session.email;
        const { pid } = req.params;
        try {
            const productoAdded = await cartsService.subtractProductToCart(email, pid);
            return res.status(201).json({
                status: "success",
                msg: "Producto agregado al carrito con exito",
                data: productoAdded,
            });
        } catch (error) {
            console.log(error);
            handleErrorResponse(res, error);
            // return res.status(500).json({
            //     status: "error",
            //     msg: "something went wrong :(",
            //     data: {},
            // });
        }
    }

    async generarTicket(req, res) {
        const email = req.session.email;
        // const { message } = req.body;
        console.log("awjdbakwjdbwakj");

        try {
            const ticketCreated = await ticketService.creatTicket(email);
            return res.status(201).json({
                status: "success",
                msg: "Mensaje agregado correctamente",
                data: ticketCreated,
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

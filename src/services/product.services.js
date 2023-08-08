import fs from "fs";
import { ChatDao } from "../DAO/classes/chat.dao.js";
import { ProductDao } from "../DAO/classes/product.dao.js";
import CustomError from "../error/custom-error.js";
import { generateProductErrorInfo, updateProductErrorInfo } from "../error/message-error.js";
import { __dirname } from "../utils.js";
import { cartsService } from "./carts.service.js";
import { UserService } from "./users.service.js";
import EErros from "../error/list-error.js";

const userService = new UserService();
const Product = new ProductDao();
const Chat = new ChatDao();
// const CartS = new CartsService();

export class ProductService {
    validateCreateProduct(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            CustomError.createError({
                name: `Product creation error`,
                cause: generateProductErrorInfo({ title, description, price, thumbnail, code, stock, status, category }),
                message: "Error trying to create product",
                code: EErros.CREATE_PRODUCT_ERROR,
            });
        }
    }
    validateUpdateProduct(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            CustomError.createError({
                name: `Product update error`,
                cause: updateProductErrorInfo({ title, description, price, thumbnail, code, stock, status, category }),
                message: "Error trying to update product",
                code: EErros.UPDATE_PRODUCT_ERROR,
            });
        }
    }
    async getAll() {
        const products = await Product.find({});
        return products;
    }
    async getAllString() {
        const products = await Product.find({});
        return JSON.parse(JSON.stringify(products));
    }

    async getById(id) {
        const products = await Product.find({ _id: id });
        return products;
    }

    async getByIdResString(id) {
        const products = await Product.find({ _id: id });
        return JSON.parse(JSON.stringify(products));
    }

    async createOne(title, description, price, thumbnail, code, stock, status, category) {
        // console.log("validate", title, description, price, thumbnail, code, stock, status, category);
        this.validateCreateProduct(title, description, price, thumbnail, code, stock, status, category);
        const productCreated = await Product.create({ title, description, price, thumbnail, code, stock, status, category });
        return productCreated;
    }

    async createMany(array) {
        array.forEach((element) => {
            this.validateCreateProduct(element.title, element.description, element.price, element.thumbnail, element.code, element.stock, element.status, element.category);
        });
        const productCreated = await Product.insertMany(array);
        return productCreated;
    }

    async deletedOne(_id) {
        const deleted = await Product.deleteOne(_id);
        return deleted;
    }

    async updateOne(_id, obj) {
        if (!_id) throw new Error("invalid _id");
        console.log("obj", obj);
        this.validateUpdateProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
        const productUptaded = await Product.updateOne(_id, obj);
        return productUptaded;
    }

    async getProductInfo(product) {
        product = JSON.parse(JSON.stringify(product));
        const array = [];
        try {
            for (const ele of product.products) {
                let getProduct = await Product.find({ _id: ele.productId });
                getProduct = JSON.parse(JSON.stringify(getProduct));
                getProduct[0].quantity = ele.quantity;
                getProduct[0].total = ele.quantity * getProduct[0].price;
                array.push(getProduct[0]);
            }
            const response = JSON.parse(JSON.stringify(array));
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getSerchQuery(query, querySerch) {
        busqueda = { [query]: [querySerch] };
        return busqueda;
    }

    async getPaginate(busqueda, limit, page, query, sort) {
        const paginate = await Product.paginate(busqueda, limit, page, query, sort);
        return paginate;
    }

    async getLink(rest, endPoint) {
        let links = [];
        for (let i = 1; i < rest.totalPages + 1; i++) {
            links.push({ label: i, href: endPoint + i });
        }
        return links;
    }

    async getNextPrevLink(rest, endPoint) {
        rest.hasPrevPage ? (rest.prevLink = endPoint + rest.prevPage) : (rest.prevLink = null);
        rest.hasNextPage ? (rest.nextLink = endPoint + rest.nextPage) : (rest.nextLink = null);
        return rest;
    }

    async getProduct(queryRes) {
        return JSON.parse(JSON.stringify(queryRes.docs));
    }

    async deleteThumbnail(product) {
        try {
            const rutaArchivo = __dirname + "/public/pictures/" + product[0].thumbnail;
            fs.unlink(rutaArchivo, (err) => {
                if (err) {
                    console.error("Error al borrar el archivo:", err);
                } else {
                    console.log("Archivo borrado exitosamente.");
                }
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getProductRender(email, query, querySerch, limit, page, sort, endPoint) {
        let name = null;
        let isLoged = false;
        let busqueda = {};
        let chat;
        let userId;
        let cart = [];
        let cartId;
        try {
            const user = await userService.getByEmail(email);
            email ? ((isLoged = true), (name = user.firstName), (cartId = user.cart)) : (isLoged = false);

            querySerch && query ? (busqueda = this.getSerchQuery(query, querySerch)) : null;

            const queryRes = await this.getPaginate(busqueda, limit, page, query, sort);

            const products = await this.getProduct(queryRes);

            const { docs, ...rest } = queryRes;

            const links = await this.getLink(rest, endPoint);

            const pagination = await this.getNextPrevLink(rest, endPoint);

            if (isLoged && email) {
                cart = await cartsService.getCartRender(email);
            }

            if (isLoged) {
                // console.log("cart", cart);
                chat = await Chat.findFirstone();

                chat = JSON.parse(JSON.stringify(chat));

                userId = JSON.parse(JSON.stringify(user._id));
            }

            return { pagination, links, products, name, isLoged, chat, userId, cart: cart.response, cartId };
        } catch (error) {
            throw error;
        }
    }

    async postProduct(obj, file) {
        if (!file) {
            throw new Error("No se ha cargado ninguna imagen");
        }
        try {
            const respuesta = await this.createOne(obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);
            let productos = await this.getById(respuesta._id);
            return productos;
        } catch (error) {}
    }

    async deleteProduct(pid) {
        try {
            let product = await this.getByIdResString(pid);
            await this.deleteThumbnail(product);
            await this.deletedOne(pid);
            const productos = await this.getAllString();
            return productos;
        } catch (error) {
            throw error;
        }
    }

    async putProduct(pid, obj) {
        try {
            await this.updateOne(pid, obj.product);
            const productos = await this.getAllString();
            return productos;
        } catch (error) {
            throw error;
        }
    }

    async postProductApi(title, description, price, file, code, stock, status, category) {
        if (!file) {
            return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
        }
        try {
            const productCreated = await this.createOne(title, description, price, file.filename, code, stock, status, category);
            return productCreated;
        } catch (error) {
            throw error;
        }
    }

    async putProductApi(id, obj) {
        try {
            await this.updateOne(id, obj);
            const product = await this.getById(id);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async getProductRenderProduct(email, query, querySerch, limit, page, sort) {
        try {
            const endPoint = "/products?page=";
            const result = await this.getProductRender(email, query, querySerch, limit, page, sort, endPoint);
            console.log("result", result);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getProductRenderSocket(email, query, querySerch, limit, page, sort) {
        try {
            const endPoint = "/realtimeproducts?page=";
            const result = await this.getProductRender(email, query, querySerch, limit, page, sort, endPoint);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

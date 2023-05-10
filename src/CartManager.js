import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export class CartManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            let cart = this.#leerArchivo(this.path);
            this.cart = cart;
        } else {
            fs.writeFileSync(path, "[]");
            let cart = this.#leerArchivo(this.path);
            this.cart = cart;
        }
    }

    async addCart() {
        let cartId = uuidv4();
        let isValid = false;

        let cart = await this.#leerArchivo(this.path);
        // let productos = await this.#leerArchivo("./src/utils/products.json");

        let carrito = {
            cartId,
            products: [],
        };

        cart.push(carrito);
        await fs.writeFileSync(this.path, JSON.stringify(cart));
        return cart;
    }

    async addProductToCart(cartId, productId) {
        let isValid = false;
        let productQuant = 1;
        let cart = await this.#leerArchivo(this.path);
        let existeCart = cart.find((x) => x.cartId == cartId);

        if (existeCart.length != 0) {
            if (existeCart.products.length == 0) {
                existeCart.products.push({ productId, quantity: productQuant });
            } else {
                // console.log("existeCart.products", existeCart.products);
                let existeProd = existeCart.products.find((x) => x.productId == productId);
                // console.log("existeProd", existeProd);
                if (existeProd == undefined) {
                    existeCart.products.push({ productId, quantity: productQuant });
                } else if (existeProd.length == 0) {
                    existeCart.products.push({ productId, quantity: productQuant });
                } else {
                    existeProd.quantity += productQuant;
                }
            }
        }

        // await fs.writeFileSync(this.path, JSON.stringify(cart));
        await this.#write(cart);
        return cart;
    }

    async getProductsCartId(id) {
        let cart = await this.#leerArchivo(this.path);
        let carrito = cart.find((x) => x.cartId == id);
        if (carrito) {
            if (carrito.products.length == 0) {
                return { state: true, productos: carrito.products, isEmpty: true };
            } else {
                return { state: true, productos: carrito.products, isEmpty: false };
            }
        } else {
            return { state: false, productos: {}, isEmpty: true };
        }
    }

    #leerArchivo = async (path) => {
        const carritoString = await fs.promises.readFile(path, "utf-8");
        let carro = [];
        try {
            carro = JSON.parse(carritoString);
        } catch (error) {}
        return carro;
    };

    // #mergeConId = async (original, upDate) => {
    //     delete upDate.producId;
    //     return await this.#mergeSinId(original, upDate);
    // };

    // #mergeSinId = (original, upDate) => {
    //     return { ...original, ...upDate };
    // };

    #write = async (array) => {
        await fs.promises.writeFile(this.path, JSON.stringify(array));
    };
}

// export const producto = new ProductManager("products.json");
export const cart = new CartManager("./src/utils/cart.json");

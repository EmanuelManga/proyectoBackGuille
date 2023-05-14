import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export class ProductManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            let products = this.#leerArchivo();
            this.products = products;
        } else {
            fs.writeFileSync(path, "[]");
            let products = this.#leerArchivo();
            this.products = products;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        let producId = uuidv4();
        let isValid = true;
        let error = null;
        status = true;

        let products = await this.#leerArchivo();
        // console.log("products", products);
        products.forEach((p) => {
            // p.producId >= producId ? (producId = p.producId + 1) : producId;
            p.code == code || isValid == false ? ((isValid = false), (error = `Error el codigo: ${code} ya existe.`)) : (isValid = true);
        });

        if ((!title, !description, !price, !thumbnail, !code, !stock, !status, !category)) {
            isValid = false;
            error = `Error "title, description, price, thumbnail, code, stock,status,category" son obligatorios`;
        }

        let product = {
            title, // (nombre del producto)
            description, // (descripción del producto)
            price, // (precio)
            thumbnail, // (ruta de imagen)
            code, // (código identificador)
            stock, // (número de piezas disponibles)
            producId,
            status,
            category,
        };

        if (isValid) {
            products.push(product);
            await fs.writeFileSync(this.path, JSON.stringify(products));
            return { state: true, id: producId };
        } else {
            // return console.log(error);
            return { state: false };
        }
    }

    async getProducts() {
        return await this.#leerArchivo();
    }

    async getProductById(id) {
        let products = await this.#leerArchivo();
        let producto = products.find((p) => p.producId == id);
        if (producto) {
            return { state: true, producto: producto };
        } else {
            return { state: false };
        }
    }

    async updateProduct(id, upDate) {
        const products = await this.#leerArchivo();
        let producto = products.find((x) => x.producId == id);
        let filtrado = products.filter((x) => x.producId != id);
        if (producto) {
            producto.producId == undefined ? (producto = await this.#mergeSinId(producto, upDate)) : (producto = await this.#mergeConId(producto, upDate));
            filtrado.push(producto);
            // return filtrado;
            await this.#write(filtrado);
            return { state: true, id: id };
        } else {
            // return "not found";
            return { state: false, id: id };
        }
    }

    async deleteProduct(id) {
        const products = await this.#leerArchivo();
        let existe = products.find((x) => x.producId == id);
        if (existe) {
            let newArray = products.filter((x) => x.producId != id);
            await this.#write(newArray);
            // return `Se elemino de la lista de productos: ${existe.title} ID ${existe.producId}`;
            return { state: true, product: { id: existe.producId, title: existe.title, description: existe.description, price: existe.price, thumbnail: existe.thumbnail, code: existe.code, stock: existe.stock } };
        } else {
            // return `No Existe un producto con ID: ${id}`;
            return { state: false, product: { id: id, title: null, description: null, price: null, thumbnail: null, code: null, stock: null } };
        }
    }

    #leerArchivo = async () => {
        const productosString = await fs.promises.readFile(this.path, "utf-8");
        let products = [];
        try {
            products = JSON.parse(productosString);
        } catch (error) {}
        return products;
    };

    #mergeConId = async (original, upDate) => {
        delete upDate.producId;
        return await this.#mergeSinId(original, upDate);
    };

    #mergeSinId = (original, upDate) => {
        return { ...original, ...upDate };
    };

    #write = async (array) => {
        await fs.promises.writeFile(this.path, JSON.stringify(array));
    };
}

// export const producto = new ProductManager("products.json");
export const producto = new ProductManager("./src/utils/products.json");

import { CartModel } from "../DAO/models/carts.model.js";
import { ProductModel } from "../DAO/models/product.model.js";

export class CartsService {
    validateUser(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const products = await CartModel.find({});
        return products;
    }

    async getById(id) {
        try {
            const realProduct = await CartModel.findById(id);
            if (!realProduct) throw new Error("cart not found");
            console.log("realProduct", realProduct);
            return realProduct;
        } catch (error) {
            console.error("Error retrieving cart:", error.message);
            // Maneja el error de acuerdo a tus necesidades (por ejemplo, retornar null, lanzar otro error personalizado, etc.)
            return null;
        }
    }

    async createOne() {
        try {
            const products = await CartModel.find({ products: { $size: 0 } });
            console.log(products);
            if (products.length !== 0) {
                try {
                    let productsParsed = JSON.parse(JSON.stringify(products));

                    for (let i = 0; i < productsParsed.length; i++) {
                        const element = productsParsed[i];
                        const deleted = await CartModel.deleteOne({ _id: element._id });
                        console.log(`Documento eliminado: ${deleted}`);
                    }
                } catch (error) {
                    console.error("Error al eliminar los documentos:", error);
                }
            }
            const cartsCreated = await CartModel.create({});
            return cartsCreated;
        } catch (error) {
            console.error("Error al crear el nuevo elemento:", error);
        }
    }

    async createMany(array) {
        array.forEach((element) => {
            this.validateUser(element.title, element.description, element.price, element.thumbnail, element.code, element.stock, element.status, element.category);
        });
        const productCreated = await CartModel.insertMany(array);
        return productCreated;
    }

    async deletedOne(_id) {
        const deleted = await CartModel.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, products) {
        console.log("_id, products", _id, products);
        if (!_id) throw new Error("invalid _id");
        const cart = await CartModel.findById(_id); // Obtener el documento del carrito por su _id
        if (!cart) throw new Error("cart not found");
        const realProduct = await ProductModel.findOne({ _id: products.productId });
        if (!realProduct) throw new Error("product not found");
        // Verificar si ya existe un producto con el mismo ID en el array
        // console.log("cart.products", cart.products);
        // console.log("realProduct", realProduct);
        const existingProduct = cart.products.find((p) => p.productId === _id + "=" + products.productId);
        // console.log("existingProduct", existingProduct);
        if (existingProduct) {
            // Si el producto ya existe, aumentar su cantidad en 1
            existingProduct.quantity += 1;
        } else {
            // Si el producto no existe, agregarlo al array con cantidad inicial 1
            let id = _id + "=" + products.productId;
            cart.products.push({ productId: id, quantity: 1 });
        }
        // Guardar los cambios en la base de datos
        const updatedCart = await cart.save();
        return updatedCart;
    }
}

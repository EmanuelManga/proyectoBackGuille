import { ProductModel } from "../DAO/models/product.model.js";
import { __dirname } from "../utils.js";

export class ProductService {
    validateUser(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const products = await ProductModel.find({});
        return products;
    }
    async getAllString() {
        const products = await ProductModel.find({});
        return JSON.parse(JSON.stringify(products));
    }

    async getById(id) {
        const products = await ProductModel.find({ _id: id });
        return products;
    }

    async getByIdResString(id) {
        const products = await ProductModel.find({ _id: id });
        return JSON.parse(JSON.stringify(products));
    }

    async createOne(title, description, price, thumbnail, code, stock, status, category) {
        console.log("validate", title, description, price, thumbnail, code, stock, status, category);
        this.validateUser(title, description, price, thumbnail, code, stock, status, category);
        const productCreated = await ProductModel.create({ title, description, price, thumbnail, code, stock, status, category });
        return productCreated;
    }

    async createMany(array) {
        array.forEach((element) => {
            this.validateUser(element.title, element.description, element.price, element.thumbnail, element.code, element.stock, element.status, element.category);
        });
        const productCreated = await ProductModel.insertMany(array);
        return productCreated;
    }

    async deletedOne(_id) {
        const deleted = await ProductModel.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, obj) {
        if (!_id) throw new Error("invalid _id");
        console.log("obj", obj);
        this.validateUser(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.status, obj.category);
        const productUptaded = await ProductModel.updateOne({ _id }, obj);
        return productUptaded;
    }

    async getProductInfo(product) {
        product = JSON.parse(JSON.stringify(product));
        const array = [];
        try {
            for (const ele of product.products) {
                let getProduct = await ProductModel.find({ _id: ele.productId });
                getProduct = JSON.parse(JSON.stringify(getProduct));
                getProduct[0].quantity = ele.quantity;
                getProduct[0].total = ele.quantity * getProduct[0].price;
                array.push(getProduct[0]);
            }
            const response = JSON.parse(JSON.stringify(array));
            return response;
        } catch (error) {
            return error;
        }
    }

    async getSerchQuery(query, querySerch) {
        busqueda = { [query]: [querySerch] };
        return busqueda;
    }

    async getPaginate(busqueda, limit, page, query, sort) {
        const paginate = await ProductModel.paginate(busqueda, { limit: limit || 10, page: page || 1, sort: { [query]: sort || 1 } });
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
            fs.unlink(rutaArchivo);
            return true;
        } catch (error) {
            return error;
        }
    }
}

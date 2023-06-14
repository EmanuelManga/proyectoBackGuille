import express from "express";
import { uploader } from "../utils.js";
import fs from "fs";
import { __dirname, __filename } from "../utils.js";

import { ProductService } from "../services/product.services.js";
import { ProductModel } from "../DAO/models/product.model.js";

export const productHtmlRouter = express.Router();

const Service = new ProductService();

productHtmlRouter.get("/", async (req, res) => {
    // try {
    //     let limit = req.query.limit;
    //     let product = await Service.getAll();
    //     limit ? (product = product.slice(0, limit)) : product;
    //     product = JSON.parse(JSON.stringify(product));
    //     console.log("pre", product);
    //     return res.status(200).render("home", { productos: product });
    // } catch (e) {
    //     console.log(e);
    //     return res.status(500).json({
    //         status: "error",
    //         msg: "something went wrong :(",
    //         data: {},
    //     });
    // }

    const { page, limit, sort, query, querySerch } = req.query;
    // console.log("req.query", req.query);
    // console.log(page);
    let busqueda = {};
    querySerch && query ? (busqueda = { [query]: [querySerch] }) : null;
    console.log("busqueda", busqueda);
    const queryRes = await ProductModel.paginate(busqueda, { limit: limit || 10, page: page || 1, sort: { [query]: sort || 1 } });
    // console.log("queryRes", queryRes);
    let products = JSON.parse(JSON.stringify(queryRes.docs));
    // console.log("products", products);
    const { docs, ...rest } = queryRes;
    let links = [];
    for (let i = 1; i < rest.totalPages + 1; i++) {
        links.push({ label: i, href: "http://localhost:8080/products?page=" + i });
    }
    // console.log("links", links);
    // console.log("rest", rest);
    return res.status(200).render("home", { productos: products, pagination: rest, links });
});

productHtmlRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let product = await Service.getById(pid);
    // let product = await Service.getAll();
    // product = product.filter((x) => x._id == pid);
    product = JSON.parse(JSON.stringify(product));
    if (product.length == 0) {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: product });
    } else {
        console.log(product);
        return res.status(200).render("home", { productos: product });
    }
});

productHtmlRouter.post("/", uploader.single("thumbnail"), async (req, res) => {
    let obj = req.body;
    console.log("obj", obj);

    const file = req.file;
    if (!file) {
        return res.status(400).json({ status: "error", msg: "No se ha cargado ninguna imagen" });
    }

    // let respuesta = await producto.addProduct(obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);
    console.log("carga", obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);
    let respuesta = await Service.createOne(obj.title, obj.description, obj.price, file.filename, obj.code, obj.stock, obj.status, obj.category);

    if (respuesta.state) {
        // let productos = await producto.getProductById(respuesta.id);
        let productos = await Service.getById(respuesta._id);
        console.log("byId", productos);
        return res.status(200).json({ status: "success", msg: "El producto fue creado con éxito", data: productos.producto });
    } else {
        return res.status(404).json({ status: "error", msg: "El producto no se pudo crear", data: {} });
    }
});

productHtmlRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let product = await Service.getById(pid);
    product = JSON.parse(JSON.stringify(product));
    const rutaArchivo = __dirname + "/public/pictures/" + product[0].thumbnail;
    let deleteProduct = await Service.deletedOne(pid);
    console.log(deleteProduct);
    if ((deleteProduct.deletedCount = 0)) {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
    } else {
        fs.unlink(rutaArchivo, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("No se pudo eliminar el archivo.");
            }
        });
        let allProductos = await Service.getAll();
        allProductos = JSON.parse(JSON.stringify(allProductos));
        console.log("allProductos", allProductos);
        return res.status(200).render("home", { productos: allProductos });
    }
});

productHtmlRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let obj = req.body;
    let product = await Service.updateOne(pid, obj.product);
    if (product) {
        let product = await Service.getAll();
        product = JSON.parse(JSON.stringify(product));
        return res.status(200).render("home", { productos: product });
    } else {
        return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
    }
});

// productHtmlRouter.get("/", async (req, res) => {
//     const array = [
//         {
//             title: "Sudadera con estampado de logo",
//             description: "Una sudadera con capucha y estampado de logo en el frente. Ideal para un estilo urbano y casual.",
//             price: 300,
//             thumbnail: "TH7890_001_20.jpg",
//             code: "SE001",
//             stock: 8,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Jeans ajustados",
//             description: "Pantalones vaqueros ajustados de corte moderno y lavado oscuro.",
//             price: 250,
//             thumbnail: "TH5678_002_21.jpg",
//             code: "JA002",
//             stock: 15,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Vestido de encaje",
//             description: "Un elegante vestido de encaje con mangas largas y detalle de lazo en la cintura.",
//             price: 450,
//             thumbnail: "TH4567_003_18.jpg",
//             code: "VE003",
//             stock: 3,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Polo de algodón",
//             description: "Un polo clásico de algodón piqué con cuello y puños en contraste.",
//             price: 180,
//             thumbnail: "TH2345_004_25.jpg",
//             code: "PA004",
//             stock: 10,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Shorts deportivos",
//             description: "Shorts deportivos ligeros y transpirables, ideales para actividades físicas.",
//             price: 120,
//             thumbnail: "TH6789_005_19.jpg",
//             code: "SD005",
//             stock: 20,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Blusa de seda",
//             description: "Una blusa elegante de seda con estampado floral y cuello en V.",
//             price: 280,
//             thumbnail: "TH3456_006_17.jpg",
//             code: "BS006",
//             stock: 6,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Abrigo de invierno",
//             description: "Un abrigo acolchado y cálido para protegerte del frío invierno.",
//             price: 600,
//             thumbnail: "TH9876_007_24.jpg",
//             code: "AI007",
//             stock: 4,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Camiseta de rayas",
//             description: "Una camiseta de manga corta con estampado de rayas horizontales.",
//             price: 150,
//             thumbnail: "TH6543_008_22.jpg",
//             code: "CR008",
//             stock: 12,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Chaleco acolchado",
//             description: "Un chaleco acolchado ligero y versátil para agregar estilo a tus conjuntos.",
//             price: 200,
//             thumbnail: "TH7654_009_20.jpg",
//             code: "CA009",
//             stock: 7,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Pantalones de vestir",
//             description: "Pantalones de vestir elegantes y formales en color negro.",
//             price: 350,
//             thumbnail: "TH5432_010_21.jpg",
//             code: "PV010",
//             stock: 9,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Blazer de lana",
//             description: "Un blazer clásico de lana con diseño de espiga y botones dorados.",
//             price: 450,
//             thumbnail: "TH8765_011_18.jpg",
//             code: "BL011",
//             stock: 5,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Leggings deportivos",
//             description: "Leggings deportivos elásticos y de secado rápido para entrenamientos intensos.",
//             price: 180,
//             thumbnail: "TH2345_012_25.jpg",
//             code: "LD012",
//             stock: 14,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Camisa a cuadros",
//             description: "Una camisa de manga larga con estampado a cuadros y corte relajado.",
//             price: 200,
//             thumbnail: "TH5678_013_19.jpg",
//             code: "CC013",
//             stock: 11,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Vestido de cóctel",
//             description: "Un elegante vestido de cóctel sin mangas con detalle de encaje en la parte superior.",
//             price: 380,
//             thumbnail: "TH7890_014_21.jpg",
//             code: "VC014",
//             stock: 6,
//             status: true,
//             category: "ropa",
//         },
//         {
//             title: "Parka impermeable",
//             description: "Una parka impermeable con capucha y forro térmico para protegerte de la lluvia y el frío.",
//             price: 550,
//             thumbnail: "TH3456_015_17.jpg",
//             code: "PI015",
//             stock: 2,
//             status: true,
//             category: "ropa",
//         },
//     ];

//     console.log(array);

//     let product = await Service.createMany(array);
//     if (product) {
//         let product = await Service.getAll();
//         product = JSON.parse(JSON.stringify(product));
//         return res.status(200).render("home", { productos: product });
//     } else {
//         return res.status(404).json({ status: "error", msg: `No Existe un producto con ID: ${pid}`, data: {} });
//     }
// });

productHtmlRouter.get("/detalle/:pid", async (req, res) => {
    let pid = req.params.pid;
    let product = await Service.getById(pid);
    // let product = await Service.getAll();
    // product = product.filter((x) => x._id == pid);
    product = JSON.parse(JSON.stringify(product));
    if (product.length == 0) {
        return res.status(404).json({ status: "error", msg: `No se encuentra ningun producto con el id: ${pid}`, data: product });
    } else {
        console.log(product);
        return res.status(200).render("detalle", { productos: product[0] });
    }
});

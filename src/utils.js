// import { connect } from "http2";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public/pictures"));
    },
    filename: (req, file, cb) => {
        // cb(null, quitarEspacios(file.originalname));
        cb(null, uuidv4() + obtenerExtension(file.originalname));
    },
});

function quitarEspacios(string) {
    return string.replace(/\s/g, "");
}

function obtenerExtension(nombreArchivo) {
    var partes = nombreArchivo.split(".");
    if (partes.length === 1 || (partes[0] === "" && partes.length === 2)) {
        return "";
    }
    return "." + partes.pop();
}

export const uploader = multer({ storage });
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// --------------------Mongo------------------------------
// const stringConect = "mongodb+srv://EmanuelMangani:vDzXZKvv15S3O8O4@backendcoder.s3uy0ix.mongodb.net/?retryWrites=true&w=majority";

import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();
export const connectMongo = async () => {
    try {
        await connect(process.env.STRINGMONGOCONNECT);
        // await connect(stringConect);
        console.log("Plug to Mongo");
    } catch (e) {
        console.log(e);
        throw "cant connect to the db ";
    }
};

//----------------bcrypt------------------------------
import bcrypt from "bcrypt";
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

//  -----------------handle-------------------------------
import handlebars from "handlebars";
handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper("notEquals", function (arg1, arg2, options) {
    return arg1 != arg2 ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper("formatNumber", function (number) {
    // number = number * 1;
    // return number.toLocaleString();
    return formatNumber(number);
});

function formatNumber(number) {
    // Asegurarse de que el número sea de tipo numérico
    if (typeof number !== "number") {
        return "NaN";
    }

    // Dividir el número en parte entera y decimal
    const parts = number.toFixed(2).split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Agregar separadores de miles (puntos)
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Combinar parte entera formateada con parte decimal y retornar el resultado
    return formattedIntegerPart + "," + decimalPart;
}

// ----------------------Testing---------------------------------

import { faker } from "@faker-js/faker";

faker.locale = "es";

export const generateUser = () => {
    const numOfProducts = parseInt(faker.random.numeric(1, { bannedDigits: ["0"] }));
    const products = [];

    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }

    return {
        name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        birthgDate: faker.date.birthdate(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        sex: faker.name.sex(),
        products,
    };
};

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(2),
        thumbnail: faker.image.image(),
        code: faker.commerce.productMaterial(),
        status: faker.datatype.boolean(),
        category: faker.commerce.productMaterial(),
    };
};

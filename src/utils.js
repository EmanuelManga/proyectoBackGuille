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

import { connect } from "mongoose";
import { stringMongoConnect } from "../variables_globales.js";

export const connectMongo = async () => {
    try {
        await connect(stringMongoConnect);
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

// import { connect } from "http2";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public"));
    },
    filename: (req, file, cb) => {
        cb(null, quitarEspacios(file.originalname));
    },
});

function quitarEspacios(string) {
    return string.replace(/\s/g, "");
}

export const uploader = multer({ storage });
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// --------------------Mongo------------------------------
const stringConect = "mongodb+srv://EmanuelMangani:vDzXZKvv15S3O8O4@backendcoder.s3uy0ix.mongodb.net/?retryWrites=true&w=majority";

import { connect } from "mongoose";

export const connectMongo = async () => {
    try {
        await connect(stringConect);
        console.log("Plug to Mongo");
    } catch (e) {
        console.log(e);
        throw "cant connect to the db ";
    }
};

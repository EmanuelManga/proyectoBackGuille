import EErros from "../error/list-error.js";

// export default (error, req, res, next) => {
//     console.log("error", error);
//     // console.log("nosequehacer", error.cause);

//     switch (error.code) {
//         case EErros.UPDATE_PRODUCT_ERROR:
//             res.status(400).send({ status: "error", error: error.name, cause: error.cause });
//             break;
//         case EErros.CREATE_PRODUCT_ERROR:
//             res.status(400).send({ status: "error", error: error.name, cause: error.cause });
//             break;
//         case EErros.INVALID_TYPES_ERROR:
//             res.status(400).send({ status: "error", error: error.name, cause: error.cause });
//             break;
//         default:
//             res.send({ status: "error", error: "Unhandled error" });
//             break;
//     }
// };

export default function handleErrorResponse(res, error) {
    switch (error.code) {
        case EErros.UPDATE_PRODUCT_ERROR:
        case EErros.CREATE_PRODUCT_ERROR:
        case EErros.INVALID_TYPES_ERROR:
        case EErros.UPDATE_PRODUCT_UNDEFINED_ID_ERROR:
        case EErros.PRODUCT_ID_ERROR:
        case EErros.CART_ID_ERROR:
        case EErros.PRODUCT_ERROR:
            return res.status(400).send({ status: "error", error: error.name, cause: error.cause });
            break;
        default:
            return res.status(401).send({ status: "error", error: "Unhandled error" });
            break;
    }
}

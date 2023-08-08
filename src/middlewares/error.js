import EErros from "../error/list-error.js";

export default (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case EErros.UPDATE_PRODUCT_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause });
        case EErros.CREATE_PRODUCT_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause });
            break;
        case EErros.INVALID_TYPES_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause });
            break;
        default:
            res.send({ status: "error", error: "Unhandled error" });
            break;
    }
};
export default class CustomError {
    static createError({ name = "Error", cause, message, code }) {
        // console.log("CustomError", message, cause);
        // Crear una instancia de Error con el mensaje
        const error = new Error(message);

        // Agregar las propiedades personalizadas
        error.name = name;
        error.code = code;
        error.cause = cause;
        // console.log(error);
        // Lanzar el error
        throw error;
    }
}

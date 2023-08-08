import CustomError from "../error/custom-error.js";
import EErros from "../error/list-error.js";
import { generateUserErrorInfo } from "../error/message-error.js";

class ErrorUtils {
    static validateUser(user) {
        CustomError.createError({
            name: "User creation error",
            cause: generateUserErrorInfo(user),
            message: "Error trying to create user",
            code: EErros.INVALID_TYPES_ERROR,
        });
    }
}

export default ErrorUtils;

import { UserModel } from "../DAO/models/users.model.js";
import { CartModel } from "../DAO/models/carts.model.js";

export class UserService {
    validateUser(firstName, lastName, email, pass, isAdmin, role, cart) {
        if (!firstName || !lastName || !email || !pass || !isAdmin || !role || !cart) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const users = await UserModel.find({});
        return users;
    }

    async getByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener el usuario por correo electrónico:", error);
            throw error;
        }
    }

    async createOne(firstName, lastName, email, pass, isAdmin, role, cart) {
        this.validateUser(firstName, lastName, email, pass, isAdmin, role, cart);
        const userCreated = await UserModel.create({ firstName, lastName, email, pass, isAdmin, role, cart });
        return userCreated;
    }

    async deletedOne(_id) {
        const deleted = await UserModel.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, firstName, lastName, email, pass, isAdmin, role, cart) {
        if (!_id) throw new Error("invalid _id");
        this.validateUser(firstName, lastName, email, pass, isAdmin, role, cart);
        const userUptaded = await UserModel.updateOne({ _id }, { firstName, lastName, email, pass, isAdmin, role, cart });
        return userUptaded;
    }
}

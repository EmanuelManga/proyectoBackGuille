import dotenv from "dotenv";
import mongoose from "mongoose";
import { createHash } from "../utils.js";
import { UserDao } from "../DAO/classes/users.dao.js";
import { CartDao } from "../DAO/classes/carts.dao.js";
dotenv.config();

const User = new UserDao();
const Cart = new CartDao();

export class UserService {
    validateUser(firstName, lastName, email, pass, isAdmin, role, cart) {
        if (!firstName || !lastName || !email || !pass || (!isAdmin && isAdmin != false) || !role || !cart) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }

    async updateLastLogin(id) {
        const uptaded = await User.updateLastLogin(id);
        return uptaded;
    }

    async getAll() {
        const users = await User.find({});
        return users;
    }
    async getAllRegisted() {
        const users = await User.find({});
        const usersRegisted = users.map((user) => {
            return { firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, role: user.role, id: user._id };
        });
        return usersRegisted;
    }

    async getByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener el usuario por correo electrónico:", error);
            throw error;
        }
    }
    async getById(id) {
        try {
            let id_mongo = null;
            if (typeof id === "string") {
                id_mongo = new mongoose.Types.ObjectId(id);
            } else {
                id_mongo = id;
            }
            const user = await User.findOne({ _id: id_mongo });
            if (user) {
                return user;
            } else {
                throw new Error("No existe");
            }
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener el usuario por correo electrónico:", error);
            throw error;
        }
    }

    async createOne(firstName, lastName, email, pass, isAdmin, role, cart) {
        this.validateUser(firstName, lastName, email, pass, isAdmin, role, cart);
        const hashPass = createHash(pass);
        const userCreated = await User.create({ firstName, lastName, email, pass: hashPass, isAdmin, role, cart });
        return userCreated;
    }

    async deletedOne(_id) {
        const deleted = await User.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, firstName, lastName, email, pass, isAdmin, role, cart) {
        if (!_id) throw new Error("invalid _id");
        this.validateUser(firstName, lastName, email, pass, isAdmin, role, cart);
        const userUptaded = await User.updateOne(_id, { firstName, lastName, email, pass, isAdmin, role, cart });
        return userUptaded;
    }

    async postUser(firstName, lastName, email, pass) {
        try {
            const isAdmin = false;
            const role = process.env.DEFAULTROLE;
            const userCreated = await this.createOne(firstName, lastName, email, pass, isAdmin, role);
            return userCreated;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const userDeleted = await this.getById(id);
            try {
                await this.deletedOne(id);
                return userDeleted;
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteUserInactives() {
        try {
            const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Calcula la fecha de hace 2 días
            const usersToDelete = await User.find({ last_login: { $lt: twoDaysAgo } }); // Encuentra los usuarios cuyo last_login es anterior a la fecha de hace 2 días
            const cartIdsToDelete = usersToDelete.map((user) => user.cart); // Obtiene los IDs de los carritos de los usuarios a borrar
            const result = await Promise.all([
                User.deleteMany({ _id: { $in: usersToDelete.map((user) => user._id) } }), // Borra los usuarios encontrados
                Cart.deleteMany({ _id: { $in: cartIdsToDelete } }), // Borra los carritos asociados a los usuarios encontrados
            ]);
            console.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async putUser(id, firstName, lastName, email, pass, isAdmin, role, cart) {
        try {
            await this.updateOne(id, firstName, lastName, email, pass, isAdmin, role, cart);
            const user = await this.getById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async toggleIsAdmin(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            user.isAdmin = !user.isAdmin;
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
    async setRole(userId, role) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            user.role = role;
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getCurrent(email) {
        try {
            const user = await User.findOne({ email });
            const current = { firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, role: user.role, cart: user.cart };
            return current;
        } catch (error) {
            // Manejo de errores
            console.error("Error al obtener el usuario por correo electrónico:", error);
            throw error;
        }
    }
}

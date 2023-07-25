import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserModel } from "../DAO/models/users.model.js";
import { createHash } from "../utils.js";
dotenv.config();

export class UserService {
    validateUser(firstName, lastName, email, pass, isAdmin, role, cart) {
        if (!firstName || !lastName || !email || !pass || (!isAdmin && isAdmin != false) || !role || !cart) {
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
    async getById(id) {
        try {
            let id_mongo = null;
            if (typeof id === "string") {
                id_mongo = new mongoose.Types.ObjectId(id);
            } else {
                id_mongo = id;
            }
            const user = await UserModel.findOne({ _id: id_mongo });
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
        const userCreated = await UserModel.create({ firstName, lastName, email, pass: hashPass, isAdmin, role, cart });
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

    async putUser(id, firstName, lastName, email, pass, isAdmin, role, cart) {
        try {
            await this.updateOne(id, firstName, lastName, email, pass, isAdmin, role, cart);
            const user = await this.getById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }
}

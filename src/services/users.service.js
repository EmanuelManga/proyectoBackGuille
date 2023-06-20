import { UserModel } from "../DAO/models/users.model.js";

export class UserService {
    validateUser(firstName, lastName, email, pass, isAdmin) {
        if (!firstName || !lastName || !email || !pass || !isAdmin) {
            console.log("validation error: please complete firstName, lastname and email.");
            throw new Error("validation error: please complete firstName, lastname and email.");
        }
    }
    async getAll() {
        const users = await UserModel.find({});
        return users;
    }

    async createOne(firstName, lastName, email, pass, isAdmin) {
        this.validateUser(firstName, lastName, email, pass, isAdmin);
        const userCreated = await UserModel.create({ firstName, lastName, email, pass, isAdmin });
        return userCreated;
    }

    async deletedOne(_id) {
        const deleted = await UserModel.deleteOne({ _id: _id });
        return deleted;
    }

    async updateOne(_id, firstName, lastName, email, pass, isAdmin) {
        if (!_id) throw new Error("invalid _id");
        this.validateUser(firstName, lastName, email, pass, isAdmin);
        const userUptaded = await UserModel.updateOne({ _id }, { firstName, lastName, email, pass, isAdmin });
        return userUptaded;
    }
}

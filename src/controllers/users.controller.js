import { UserService } from "../services/users.service.js";

const userService = new UserService();

class UserController {
    async getAll(req, res) {
        try {
            const users = await userService.getAllRegisted();
            // console.log(users);
            return res.status(200).json({
                status: "success",
                msg: "listado de usuarios",
                data: users,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async postUser(req, res) {
        try {
            const { firstName, lastName, email, pass } = req.body;

            const userCreated = await userService.postUser(firstName, lastName, email, pass);
            return res.status(201).json({
                status: "success",
                msg: "user created",
                data: userCreated,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const userDeleted = await userService.deleteUser(id);
            return res.status(200).json({
                status: "success",
                msg: "user deleted",
                data: userDeleted,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async deleteUserInactives(req, res) {
        try {
            const userDeleted = await userService.deleteUserInactives();
            return res.status(200).json({
                status: "success",
                msg: "user deleted",
                data: userDeleted,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async putUser(req, res) {
        try {
            const { id } = req.params;
            const { firstName, lastName, email, pass, isAdmin, role, cart } = req.body;

            const user = await userService.putUser(id, firstName, lastName, email, pass, isAdmin, role, cart);
            // console.log("user", user);
            return res.status(201).json({
                status: "success",
                msg: "user uptaded",
                data: user,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
    async toggleIsAdmin(req, res) {
        try {
            const { id } = req.params;

            const user = await userService.toggleIsAdmin(id);
            // console.log("user", user);
            return res.status(201).json({
                status: "success",
                msg: "user uptaded",
                data: user,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
    async setRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await userService.setRole(id, role);
            // console.log("user", user);
            return res.status(201).json({
                status: "success",
                msg: "user uptaded",
                data: user,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
}

export const userController = new UserController();

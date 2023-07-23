import { UserService } from "../services/users.service.js";
import dotenv from "dotenv";
dotenv.config();

const userService = new UserService();
class UserController {
    async getAll(req, res) {
        try {
            const users = await userService.getAll();
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
            const isAdmin = false;
            const role = process.env.DEFAULTROLE;
            const userCreated = await userService.createOne(firstName, lastName, email, pass, isAdmin, role);
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
            const userDelete = await Service.deletedOne(id);
            //TODO LLAMAR A OTA FUNCION
            return res.status(200).json({
                status: "success",
                msg: "user deleted",
                data: {},
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

            await userService.updateOne(id, firstName, lastName, email, pass, isAdmin, role, cart);
            const user = await userService.getById(id);
            console.log("user", user);
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

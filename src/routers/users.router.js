import express from "express";
import { UserService } from "../services/users.service.js";
import { isAdmin, isUser } from "../middlewares/auth.js";
import { defaultRole } from "../../variables_globales.js";

export const usersRouter = express.Router();

const Service = new UserService();

usersRouter.get("/", async (req, res) => {
    try {
        const users = await Service.getAll();
        console.log(users);
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
});

usersRouter.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, pass } = req.body;
        const isAdmin = false;
        const role = defaultRole;
        const userCreated = await Service.createOne(firstName, lastName, email, pass, isAdmin, role);
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
});

usersRouter.delete("/:id", async (req, res) => {
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
});

usersRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, pass, isAdmin, role } = req.body;

        const user = await Service.updateOne(id, firstName, lastName, email, pass, isAdmin, role);

        //TODO LLAMAR A OTRA FUNCION
        return res.status(201).json({
            status: "success",
            msg: "user uptaded",
            data: { _id: id, firstName, lastName, email, pass, isAdmin, role },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

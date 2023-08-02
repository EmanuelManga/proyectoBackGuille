import { TicketService } from "../services/ticket.service.js";

const ticketService = new TicketService();

class TicketController {
    async getAll(req, res) {
        const email = req.session.email;
        try {
            const chat = await ticketService.getAll();
            // return res.status(200).render("cart", { productos: cart.response, name: cart.name, isLoged: true });
            return res.status(200).json({ status: "success", msg: `Bien`, data: chat });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }

    async creatTicket(req, res) {
        const email = req.session.email;
        // const { message } = req.body;
        try {
            const ticketCreated = await ticketService.creatTicket(email);
            return res.status(201).json({
                status: "success",
                msg: "Mensaje agregado correctamente",
                data: ticketCreated,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async email(req, res) {
        const email = req.session.email;
        // const { message } = req.body;
        try {
            const ticketCreated = await ticketService.creatTicket(email);
            return res.status(201).json({
                status: "success",
                msg: "Mensaje agregado correctamente",
                data: ticketCreated,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async generarTicket(req, res) {
        const email = req.session.email;
        // const { message } = req.body;
        try {
            const ticketCreated = await ticketService.creatTicket(email);
            return res.status(201).json({
                status: "success",
                msg: "Mensaje agregado correctamente",
                data: ticketCreated,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
}

export const ticketController = new TicketController();

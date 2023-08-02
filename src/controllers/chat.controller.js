import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

class ChatController {
    async getFirstone(req, res) {
        const email = req.session.email;
        try {
            const chat = await chatService.findFirstone();
            // return res.status(200).render("cart", { productos: cart.response, name: cart.name, isLoged: true });
            return res.status(200).json({ status: "success", msg: `Bien`, data: chat });
        } catch (error) {
            return res.status(404).json({ status: "error", msg: `Ha ocurrido un error`, data: {} });
        }
    }

    async addMessage(req, res) {
        const email = req.session.email;
        const { message } = req.body;
        try {
            const messageAdded = await chatService.addMessage(email, message);
            return res.status(201).json({
                status: "success",
                msg: "Mensaje agregado correctamente",
                data: messageAdded,
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

export const chatController = new ChatController();

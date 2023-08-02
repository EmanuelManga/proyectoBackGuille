import { SessionService } from "../services/session.services.js";
import { UserService } from "../services/users.service.js";

const sessionService = new SessionService();
const userService = new UserService();

class SessionController {
    async gitCallBack(req, res) {
        req.session.email = req.user.email;
        res.redirect("/realtimeproducts");
    }

    async showCurrent(req, res) {
        return res.send(await sessionService.currentSessionParse(req));
    }

    async current(req, res) {
        try {
            const email = req.session.email;
            const getCurrent = await userService.getCurrent(email);
            return res.status(201).json({
                status: "success",
                msg: "Current User",
                data: getCurrent,
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

export const sessionController = new SessionController();

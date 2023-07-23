import { SessionService } from "../services/session.services.js";
import { UserService } from "../services/users.service.js";

const sessionService = new SessionService();
const userService = new UserService();

class SocketService {}

export const socketService = new SocketService();

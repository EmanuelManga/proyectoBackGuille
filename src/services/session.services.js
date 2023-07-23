import passport from "passport";
export class SessionService {
    async currentSessionParse(req) {
        return JSON.stringify(req.session);
    }
}

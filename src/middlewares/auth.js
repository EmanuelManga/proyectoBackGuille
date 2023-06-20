import session from "express-session";
export function isUser(req, res, next) {
    if (req.session?.email) {
        return next();
    }
    // return res.status(401).render("login", { error: "error de autenticacion!" });
    return res.redirect("/auth/login");
}
export function isUserAjax(req, res, next) {
    if (req.session?.email) {
        return next();
    }
    // return res.status(401).render("login", { error: "error de autenticacion!" });
    // return res.redirect("/auth/login");
    return res.status(401).json({ msg: "No se encuentra logeado" });
}

export function isAdmin(req, res, next) {
    if (req.session?.isAdmin) {
        return next();
    }
    return res.status(403).render("error", { error: "error de autorización!" });
}

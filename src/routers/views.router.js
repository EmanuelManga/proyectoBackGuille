import express from "express";
export const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
    // res.render("home");
    res.redirect("/realtimeproducts");
});

viewsRouter.get("/login", async (req, res) => {
    res.render("login");
});

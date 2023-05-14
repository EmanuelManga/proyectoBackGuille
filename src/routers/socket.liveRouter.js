import express from "express";

export const testSocketRouter = express.Router();

testSocketRouter.get("/", (req, res) => {
    return res.render("test-socket", {});
});

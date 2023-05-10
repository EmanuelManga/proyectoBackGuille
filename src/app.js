import express from "express";
import { productRouter } from "./routers/produts.router.js";
import { cartRouter } from "./routers/carts.router.js";

// console.log(express);

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});

app.get("/*", async (req, res) => {
    return res.status(404).json({ status: "error", msg: "no encontrado", data: {} });
});

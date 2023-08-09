import { MockingproductsService } from "../services/mockingproducts.services.js";

const Moking = new MockingproductsService();

class MockingproductsController {
    async getMockingProduct(req, res) {
        // const { email, pass, firstName, lastName } = req.body;

        try {
            // req.session.id = user._id;
            const products = await Moking.getMockingProduct();
            return res.status(200).json({ status: "success", msg: ``, data: products });
        } catch (e) {
            console.log(e);
            return res.status(400).render("error", { error: "no se pudo crear el usuario. Intente con otro mail." });
        }
    }
}

export const mockingproductsController = new MockingproductsController();

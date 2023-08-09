import { generateProduct } from "../utils.js";

export class MockingproductsService {
    async getMockingProduct() {
        try {
            const products = [];
            for (let i = 0; i < 100; i++) {
                products.push(generateProduct());
            }
            return products;
        } catch (error) {
            throw error;
        }
    }
}

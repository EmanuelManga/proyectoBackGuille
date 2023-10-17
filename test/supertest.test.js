import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/");

describe("TEST API", () => {
    let cookieName;
    let cookieValue;
    // let cookie;

    describe("ENDPOINT Auth", () => {
        const mockUser = {
            firstName: "Coder",
            lastName: "Test",
            age: 100,
            email: "tester@gmail.com",
            pass: "123",
        };

        // it("REGISTER", async () => {
        //     const response = await requester.post("auth/register").send(mockUser);

        //     if (response.error) {
        //         throw new Error(response.error.message);
        //     }

        //     const { status } = response;

        //     expect(status).to.equal(302);
        // });

        it("LOGIN", async () => {
            const result = await requester.post("auth/login").send({
                // email: "emanuel_mangani@hotmail.com",
                // password: "asdasd123",
                email: "tester@gmail.com",
                password: "123",
            });

            const cookie = result.headers["set-cookie"][0];
            // console.log(result.headers);
            expect(cookie).to.be.ok;
            // console.log(cookie);

            cookieName = cookie.split("=")[0];
            cookieValue = cookie.split("=")[1];
            cookieValue = cookieValue.split(";")[0].trim();
            // console.log(cookie);

            expect(cookieName).to.be.ok.and.eql("connect.sid");
            expect(cookieValue).to.be.ok;
        });

        it("CURRENT USER", async () => {
            console.log(cookieName);
            console.log(cookieValue);
            const { _body } = await requester
                .get("api/sessions/current")
                .set("Cookie", [`${cookieName}=${cookieValue}`])
                // .set("Cookie", [`connect.sid=s%3Am6InJkqee1ZrYuS6DHwn6mmP8pwujJJu.MN9Ox%2FfYlvnDeGTgp60iF0%2FfWrICjvr3Nlk3mhzgWeU`])
                // .set("Cookie", [`connect.sid=s%3AF7zZXHSOa2NkoOnnSZA5_xXK0DFOQ4dU.4A2RGNQY6tL9h9xmacKn5c05YZkmYJMFlJsAfl%2Bg02s`])
                // .set("Cookie", [`connect.sid=s%3Ak7w8zBB6TAo_zc996roOgV4eQxajh55C.WythUSqwqc1LbbIP2NBr%2BDuxHlpfFkgyfnnPhByY5jo`])
                // .set("Cookie", [`connect.sid=s%3AfUJ603PBPOUCt_gyfuavWrNl0qWUhoYL.61bLWVREcSA1TaY43SRaqKNVefAzovV8EfluFQ8KC1k`])
                .set("x-test-request", "true");

            console.log(_body);

            expect(_body.data.email).to.be.eql(mockUser.email);
        });
    });
    // describe("ENDPOINT Products", () => {
    //     it("GET", async () => {
    //         const response = await requester.get("api/products");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(200);
    //         expect(_body.payload).to.be.an.instanceof(Array);
    //     });
    //     it("POST", async () => {
    //         const productMock = {
    //             title: "Producto de prueba",
    //             description: "Esta es una descripción de prueba",
    //             category: "Electrónica",
    //             price: 29.99,
    //             thumbnail: "https://ejemplo.com/imagen.jpg",
    //             code: "ls1234",
    //             stock: 10,
    //             status: true,
    //         };
    //         const response = await requester
    //             .post("api/products")
    //             .send(productMock)
    //             .set("Cookie", [`${cookieName}=${cookieValue}`])
    //             .set("x-test-request", "true");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(201);
    //         expect(_body.payload).to.have.property("_id");
    //     });
    //     it("PUT", async () => {
    //         const productIdToUpdate = "6485df28a915e909d0a31769";
    //         const updatedProductData = {
    //             title: "Pantalones vaqueros",
    //             description: "Pantalones vaqueros clásicos de ajuste regular hechos de denim resistente.",
    //             category: "ropa",
    //             price: 375,
    //             thumbnail: "TH8903_002_22.avif",
    //             code: "PV0021",
    //             stock: 30,
    //         };
    //         const response = await requester.put(`api/products/${productIdToUpdate}`).send(updatedProductData).set("x-test-request", "true");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(201);
    //         expect(_body.payload).to.have.eql(`Has actualizado el producto con ID ${productIdToUpdate}`);
    //     });
    //     it("DELETE", async () => {
    //         const productIdToDelete = "65272be3d96fa427ea3566de";
    //         const response = await requester
    //             .delete(`api/products/${productIdToDelete}`)
    //             .set("Cookie", [`${cookieName}=${cookieValue}`])
    //             .set("x-test-request", "true");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(200);
    //         expect(_body.payload).to.have.eql(`Has eliminado el producto con ID ${productIdToDelete}`);
    //     });
    // });

    // describe("ENDPOINT Carts", () => {
    //     it("GET", async () => {
    //         const response = await requester.get("api/carts");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(200);
    //         expect(_body.payload).to.be.an.instanceof(Array);
    //     });
    //     it("POST", async () => {
    //         // const cartId = "ToIthONHr1Xm07DlvaADPma9b";
    //         const prodId = "647b6a402a2deaefe1fc2848";
    //         const response = await requester.post(`api/carts/products/${prodId}`).set("x-test-request", "true");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(200);
    //         expect(_body.payload.cart).to.have.property("_id");
    //     });
    //     it("PUT add-product", async () => {
    //         const prodId = "6485dfb0ecaaf548941de5a2";
    //         const response = await requester.put(`api/carts/add-product/${prodId}`).send(updatedCartData).set("x-test-request", "true");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(200);
    //         expect(_body.message).to.have.eql("Cart updated successfully");
    //         expect(_body.cart).to.have.property("_id");
    //     });
    //     it("PUT add-product", async () => {
    //         const prodId = "6485dfb0ecaaf548941de5a2";
    //         const response = await requester.put(`api/carts/subtract-product/${prodId}`).send(updatedCartData).set("x-test-request", "true");
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(200);
    //         expect(_body.message).to.have.eql("Cart updated successfully");
    //         expect(_body.cart).to.have.property("_id");
    //     });
    //     it("DELETE", async () => {
    //         const cartIdToDelete = "6485dfb0ecaaf548941de5a2";
    //         const response = await requester.delete(`api/carts/${cartIdToDelete}`);
    //         if (response.error) {
    //             throw new Error(response.error.message);
    //         }
    //         const { status, _body } = response;
    //         expect(status).to.equal(200);
    //         expect(_body.message).to.have.eql("Cart cleared successfully");
    //     });
    // });
});

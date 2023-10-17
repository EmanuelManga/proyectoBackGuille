import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/");

describe("TEST API", () => {
    let cookieName;
    let cookieValue;

    describe("ENDPOINT Auth", () => {
        const mockUser = {
            firstName: "Coder",
            lastName: "Test",
            age: 100,
            email: "tester@gmail.com",
            pass: "123",
        };

        it("LOGIN", async () => {
            const result = await requester.post("auth/login").send({
                email: "tester@gmail.com",
                pass: "123",
            });

            const cookie = result.headers["set-cookie"][0];
            expect(cookie).to.be.ok;

            cookieName = cookie.split("=")[0];
            cookieValue = cookie.split("=")[1];
            // cookieValue = cookieValue.split(";")[0].trim();

            expect(cookieName).to.be.ok.and.eql("connect.sid");
            expect(cookieValue).to.be.ok;
        });

        it("CURRENT USER", async () => {
            const { _body } = await requester
                .get("api/sessions/current")
                .set("Cookie", [`${cookieName}=${cookieValue}`])
                .set("x-test-request", "true");

            expect(_body.data.email).to.be.eql(mockUser.email);
        });
    });
});

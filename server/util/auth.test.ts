import { Schema } from "mongoose";
import { App } from "../../types/index";
import Employee from "../employee/employee.model";
import Token from "./auth";

describe("auth tests", () => {
    const employeeRecord = {
        company: "5c81ca16d1418402eec0398b",
        email: "figginsc@gmail.com",
        id: "5c825de72bff6914c6cf263b",
        role: "owner",
    };

    const employee = new Employee(employeeRecord);

    beforeAll(async () => {
        await Token.init();
    });

    it("should initialize the token creation", async () => {
        const response = await Token.init();

        expect(response).toBeTruthy();
    });

    // it("should sign a new token", async () => {
    //     await Token.init();
    //     const token = await Token.sign(employee);

    //     console.log(token);
    // });
});

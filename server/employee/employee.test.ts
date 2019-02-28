import MongodbMemoryServer from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as request from "supertest";
import app from "../app";
import Employee from "./employee.model";

describe("/api/employee tests", () => {
    const mongod = new MongodbMemoryServer();

    beforeAll(async () => {
        const uri = await mongod.getConnectionString();
        await mongoose.connect(uri, { useNewUrlParser: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });

    afterEach(async () => {
        await Employee.remove({});
    });

    beforeEach(async () => {
        const employee = {
            company: "5c768ea0ca379cfc5b1be974",
            device: {
                consent: true,
                manufacturer: "Fitbit",
                type: "Charge 3",
            },
            dob: new Date(),
            email: "figginsc@gmail.com",
            first_name: "Chris",
            last_name: "Figgins",
            phone: "5555325252",
            preferences: {
                launchpage: "dashboard",
            },
            registered: true,
            role: "owner",
            schedule: [
                {
                    end: null,
                    start: null,
                    working: false,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: null,
                    start: null,
                    working: false,
                },
            ],
            sms_consent: true,
            token: "abcdef",
        };

        const newEmployee = new Employee(employee);
        await newEmployee.save();
    });

    // Unit Test
    it("should get all employees", async () => {
        const response = await request(app)
            .get("/api/employee/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([expect.objectContaining({ company: "5c768ea0ca379cfc5b1be974", role: "owner" })]);
    });

    // Unit Test
    it("should get an employee", async () => {
        const employeeInfo = await Employee.findOne({ last_name: "Figgins" });

        const response = await request(app)
            .get(`/api/employee/${employeeInfo._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([expect.objectContaining({ company: "5c768ea0ca379cfc5b1be974", role: "owner" })]);
    });

    // Unit Test
    it("should get an employee by company id", async () => {
        const employeeInfo = await Employee.findOne({ last_name: "Figgins" });

        const response = await request(app)
            .get(`/api/employee/bycustomer/${employeeInfo.company}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([expect.objectContaining({ company: "5c768ea0ca379cfc5b1be974", role: "owner" })]);
    });

    // Unit Test
    it("should not get an employee by company id", async () => {
        const response = await request(app)
            .get(`/api/employee/bycustomer/lkjlkjlkjklj-klj*`);

        expect(response.status).toBe(404);
    });

    // Unit Test
    it("should not find a employee", async () => {

        const response = await request(app)
            .get(`/api/employee/asdfasdf`);

        expect(response.status).toBe(404);
    });

    // Unit Test
    it("should post a new employee", async () => {
        const newEmployee = {
            company: "5c768ea0ca379cfc5b1be964",
            device: {
                consent: true,
                manufacturer: "Fitbit",
                type: "Charge 3",
            },
            dob: new Date(),
            email: "figgin@gmail.com",
            first_name: "Chris",
            last_name: "Figgins",
            phone: "5555325252",
            preferences: {
                launchpage: "dashboard",
            },
            registered: true,
            role: "owner",
            schedule: [
                {
                    end: null,
                    start: null,
                    working: false,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: null,
                    start: null,
                    working: false,
                },
            ],
            sms_consent: true,
            token: "abcdef",
        };

        const response = await request(app)
            .post("/api/employee")
            .send(newEmployee);

        expect(response.status).toBe(201);
        expect(response.body).toBe("Employee saved!");
    });

    // Unit Test
    it("should toss an error trying to add a new employee", async () => {
        const newEmployee = {
            company: "5c768ea0ca379cfc5b1be964",
            device: {
                consent: true,
                manufacturer: "Fitbit",
                type: "Charge 3",
            },
            dob: new Date(),
            email: "figginsc@gmail.com",
            first_name: "Chris",
            last_name: "Figgins",
            phone: "5555325252",
            preferences: {
                launchpage: "dashboard",
            },
            registered: true,
            role: "owner",
            schedule: [
                {
                    end: null,
                    start: null,
                    working: false,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: "08:00:00",
                    start: "17:00:00",
                    working: true,
                },
                {
                    end: null,
                    start: null,
                    working: false,
                },
            ],
            sms_consent: true,
            token: "abcdef",
        };

        const response = await request(app)
            .post("/api/employee")
            .send(newEmployee);

        expect(response.status).toBe(400);
    });

    // Unit Test
    it("should delete an employee", async () => {
        const employeeInfo = await Employee.findOne({ email: "figginsc@gmail.com" });

        const response = await request(app)
            .delete(`/api/employee/${employeeInfo._id}`);

        expect(response.status).toBe(202);
        expect(response.body).toBe("Employee deleted!");
    });

    // Unit Test
    it("should toss an error trying to delete an employee", async () => {
        const response = await request(app)
            .delete("/api/employee/43234234324234");

        expect(response.status).toBe(404);
    });

    // Unit Test
    it("should update an employee", async () => {
        const employeeInfo = await Employee.findOne({ email: "figginsc@gmail.com" });
        const packageInfo = { phone: "5554445252" };

        const response = await request(app)
            .put(`/api/employee/${employeeInfo._id}`)
            .send(packageInfo);

        expect(response.status).toBe(202);
        expect(response.body).toBe("Employee updated!");

        const employeeInfoUpdate = await Employee.findOne({ email: "figginsc@gmail.com" });
        expect(employeeInfoUpdate.phone).toBe("5554445252");
    });

    // Unit Test
    it("should not update an employee", async () => {
        const packageInfo = { package: "silver" };

        const response = await request(app)
            .put(`/api/employee/sdfasdf`)
            .send(packageInfo);

        expect(response.status).toBe(404);
    });
});

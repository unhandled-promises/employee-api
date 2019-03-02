import * as bodyParser from "body-parser";
import * as express from "express";
import Token from "../util/auth";
import Comm from "../util/comm";
import Encryption from "../util/crypto";
import Employee from "./employee.model";

const router = express.Router();

router.route("/login").post(bodyParser.json(), async (request, response) => {
    try {
        const password = Encryption.encrypt(request.body.password);
        const email = request.body.email;

        const employee = await Employee.findOne({ email, password });

        if (employee) {
            if (employee.registered) {
                const jwtToken = await Token.sign(employee);
                return response.status(200).json(
                    {
                        message: "Authentication Successful!",
                        success: true,
                        token: jwtToken,
                    },
                );
            } else {
                throw Error("Not Verified");
            }
        } else {
            throw Error("Login Failed");
        }
    } catch (error) {
        console.log(error);
        return response.status(401).json(error.toString());
    }
});

router.route("/verify").post(bodyParser.json(), async (request, response) => {
    try {
        console.log(request);

        const token = request.body.token;
        const email = request.body.email;

        const employee = await Employee.findOne({ email, token });

        if (employee) {
            await Employee.update({ _id: employee._id }, { registered: true }, { new: true });

            const jwtToken = await Token.sign(employee);
            return response.status(200).json(
                {
                    message: "Authentication Successful!",
                    success: true,
                    token: jwtToken,
                },
            );
        } else {
            throw Error;
        }
    } catch (error) {
        return response.status(401).json("Verification Failed");
    }
});

router.route("/").post(bodyParser.json(), async (request, response) => {
    try {
        const employee = new Employee(request.body);

        if (request.body.password) {
            employee.password = Encryption.encrypt(request.body.password);
        }

        employee.token = Encryption.createVerificationCode();

        await employee.save();
        const emailContent = {
            from: "test@special.com",
            html: `Welcome! Your token is: ${employee.token}`,
            subject: "Welcome!",
            to: employee.email,
        };

        Comm.sendEmail(emailContent);

        return response.status(201).json("Employee created!");
    } catch (error) {
        return response.status(400).json("Employee not created");
    }
});

router.route("/:id").get(Token.authenticate, async (request, response, next) => {
    try {
        if (Token.authorize("id", request)) {
            const employeeId = request.params.id;
            const employees = await Employee.find({ _id: employeeId });
            return response.status(200).json(employees);
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

router.route("/bycustomer/:id").get(Token.authenticate, async (request, response) => {
    try {
        if (Token.authorize("customer", request)) {
            const customerId = request.params.id;
            const employees = await Employee.find({ company: customerId });
            return response.status(200).json(employees);
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

router.route("/:id").delete(Token.authenticate, async (request, response) => {
    try {
        if (Token.authorize("id", request)) {
            const employeeId = request.params.id;
            await Employee.findOneAndRemove({ _id: employeeId });
            return response.status(202).json("Employee deleted!");
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

router.route("/:id").put(Token.authenticate, bodyParser.json(), async (request, response) => {
    try {
        if (Token.authorize("id", request)) {
            const employeeId = request.params.id;
            const employeeUpdate = request.body;
            await Employee.update({ _id: employeeId }, employeeUpdate, { new: true });
            return response.status(202).json("Employee updated!");
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

export default router;

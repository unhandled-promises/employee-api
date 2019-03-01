import * as bodyParser from "body-parser";
import * as express from "express";
import Encryption from "../util/crypto";
import Token from "../util/jwt";
import Employee from "./employee.model";

const router = express.Router();

router.route("/login").post(bodyParser.json(), async (request, response) => {
    try {
        const password = Encryption.encrypt(request.body.password);
        const email = request.body.email;

        const employee = await Employee.findOne({ email, password });

        if (employee) {
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
        return response.status(401).send("Login Failed");
    }
});

router.route("/verify").post(bodyParser.json(), async (request, response) => {
    try {
        const token = request.body.token;
        const email = request.body.email;

        const employee = await Employee.findOne({ email, token });

        if (employee) {
            await Employee.update({ _id: employee._id }, { registered: true }, {new: true});

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
        return response.status(401).send("Verification Failed");
    }
});

router.route("/").post(bodyParser.json(), async (request, response) => {
    try {
        const employee = new Employee(request.body);
        await employee.save();
        return response.status(201).json("Employee saved!");
    } catch (error) {
        return response.status(400).send(error);
    }
});

router.route("/:id").get(Token.authenticate, async (request, response) => {
    try {
        const employeeId = request.params.id;
        const employees = await Employee.find({ _id: employeeId });
        return response.status(200).json(employees);
    } catch (error) {
        return response.status(404).send(error);
    }
});

router.route("/bycustomer/:id").get(async (request, response) => {
    try {
        const customerId = request.params.id;
        const employees = await Employee.find({ company: customerId });
        return response.status(200).json(employees);
    } catch (error) {
        return response.status(404).send(error);
    }
});

router.route("/:id").delete(async (request, response) => {
    try {
        const employeeId = request.params.id;
        await Employee.findOneAndRemove({ _id: employeeId });
        return response.status(202).json("Employee deleted!");
    } catch (error) {
        return response.status(404).send(error);
    }
});

router.route("/:id").put(bodyParser.json(), async (request, response) => {
    try {
        const employeeId = request.params.id;
        const employeeUpdate = request.body;
        await Employee.update({ _id: employeeId }, employeeUpdate, {new: true});
        return response.status(202).json("Employee updated!");
    } catch (error) {
        return response.status(404).send(error);
    }
});

export default router;

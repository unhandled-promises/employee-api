import * as bodyParser from "body-parser";
import * as express from "express";
import Employee from "./employee.model";
import Encryption from "../util/crypto";
import Token from "../util/jwt";

const router = express.Router();

router.route("/login").post(bodyParser.json(), async (request, response) => {
    try {
        const password = Encryption.encrypt(request.body.password);
        const email = request.body.email;

        const employee = await Employee.findOne({ email: email, password: password });

        if (employee) {
            const token = Token.sign(employee);
            return response.status(200).json(token);
        } else {
            throw Error;
        }
    } catch (error) {
        return response.status(401).send("Login Failed");
    }
});

router.route("/").get(async (request, response) => {
    try {
        const employees = await Employee.find();
        return response.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return response.status(400).send(error);
    }
});

router.route("/").post(bodyParser.json(), async (request, response) => {
    try {
        const employee = new Employee(request.body);
        await employee.save();
        return response.status(201).json("Employee saved!");
    } catch (error) {
        console.log(error);
        return response.status(400).send(error);
    }
});

router.route("/:id").get(async (request, response) => {
    try {
        const employeeId = request.params.id;
        const employees = await Employee.find({ _id: employeeId });
        return response.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return response.status(404).send(error);
    }
});

router.route("/bycustomer/:id").get(async (request, response) => {
    try {
        const customerId = request.params.id;
        const employees = await Employee.find({ company: customerId });
        return response.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return response.status(404).send(error);
    }
});

router.route("/:id").delete(async (request, response) => {
    try {
        const employeeId = request.params.id;
        await Employee.findOneAndRemove({ _id: employeeId });
        return response.status(202).json("Employee deleted!");
    } catch (error) {
        console.log(error);
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
        console.log(error);
        return response.status(404).send(error);
    }
});

export default router;

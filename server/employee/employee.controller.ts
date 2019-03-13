import axios from "axios";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as moment from "moment";

import { CUSTOMERS_API, USER_INTERFACE } from "../config/api-config";

import Employee from "./employee.model";

import Token from "../util/auth";
import Comm from "../util/comm";
import Encryption from "../util/crypto";
import Fitbit from "../util/fitbit";

const router = express.Router();

// Resource: Employee
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
        return response.status(401).json(error.toString());
    }
});

// Resource: Employee
router.route("/verify").post(bodyParser.json(), async (request, response) => {
    try {
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

// Resource: Employee
router.route("/").post(Token.authenticate, bodyParser.json(), async (request, response) => {
    try {
        if (await Token.authorize(["supervisor"], request, false)) {
            const employee = new Employee(request.body);

            if (request.body.password) {
                employee.password = Encryption.encrypt(request.body.password);
            }

            if (request.body.access_token) {
                employee.access_token = Encryption.encrypt(request.body.access_token);
            }

            if (request.body.refresh_token) {
                employee.refresh_token = Encryption.encrypt(request.body.refresh_token);
            }

            employee.token = Encryption.createVerificationCode();

            await employee.save();
            const emailContent = {
                dynamic_template_data: {
                    code: employee.token,
                  },
                from: "noreply@fit2work.life",
                templateId: "d-897fb7dc7d1145d6889f5fc7bebc6cdc",
                to: employee.email,
            };

            Comm.sendEmail(emailContent);

            return response.status(201).json("Employee created!");
        }
    } catch (error) {
        return response.status(400).json("Employee not created");
    }
});

// Resource: Employee
router.route("/init").post(bodyParser.json(), async (request, response) => {
    try {
        const employee = new Employee(request.body);
        employee.role = "owner";
        employee.token = Encryption.createVerificationCode();

        // Verify company
        const company = await axios.get(`${CUSTOMERS_API}api/customers/${employee.company}/exist`);

        // Verify no employees
        const employees = await Employee.find({ company: employee.company });

        if (employees.length === 0 && company.status === 200) {
            await employee.save();
        } else {
            throw Error("Employee already created");
        }

        return response.status(302).json(`${USER_INTERFACE}verify?t=${employee.token}&e=${employee.email}`);
    } catch (error) {
        return response.status(400).json(error.toString());
    }
});

// Resource: Employee
router.route("/:id").get(Token.authenticate, async (request, response, next) => {
    try {
        if (await Token.authorize(["employee", "supervisor"], request, false)) {
            const employeeId = request.params.id;
            let employee = await Employee.findById(employeeId);

            employee = employee.toObject();

            delete employee.password;
            delete employee.token;

            if (employee.access_token) {
                employee.access_token = Encryption.decrypt(employee.access_token);
            }

            if (employee.refresh_token) {
                employee.refresh_token = Encryption.decrypt(employee.refresh_token);
            }

            return response.status(200).json(employee);
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

router.route("/:id/activities/heart").get(Token.authenticate, async (request, response, next) => {
    try {
        if (await Token.authorize(["employee", "supervisor"], request, false)) {
            const employeeId = request.params.id;
            let employee = await Employee.findById(employeeId);
            employee = employee.toObject();
            const activities = await Fitbit.callFitbit(employee, `activities/heart/date/today/1d.json`);
            return response.status(200).json(activities);
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

router.route("/:id/activities").get(Token.authenticate, async (request, response, next) => {
    try {
        if (await Token.authorize(["employee", "supervisor"], request, false)) {
            const employeeId = request.params.id;
            let employee = await Employee.findById(employeeId);
            employee = employee.toObject();
            const today = moment().format("YYYY-MM-DD");
            try {
                const activities = await Fitbit.callFitbit(employee, `activities/date/${today}.json`);
                return response.status(200).json(activities);
            } catch (error) {
                return response.status(400).send(error);
            }

        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

// Resource: Employee
router.route("/bycustomer/:id").get(Token.authenticate, async (request, response) => {
    try {
        if (await Token.authorize(["customer"], request, false)) {
            const customerId = request.params.id;
            const employees = await Employee.find({ company: customerId });

            employees.map((employee) => {
                employee.password = null;
                employee.token = null;

                if (employee.access_token) {
                    employee.access_token = Encryption.decrypt(employee.access_token);
                }

                if (employee.refresh_token) {
                    employee.refresh_token = Encryption.decrypt(employee.refresh_token);
                }
            });

            return response.status(200).json(employees);
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

// Resource: Employee
router.route("/:id").delete(Token.authenticate, async (request, response) => {
    try {
        if (await Token.authorize(["employee", "supervisor"], request, false)) {
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

// Resource: Employee
router.route("/:id").put(Token.authenticate, bodyParser.json(), async (request, response) => {
    try {
        if (await Token.authorize(["employee", "supervisor"], request, false)) {
            const employeeId = request.params.id;
            const employeeUpdate = request.body;

            if (employeeUpdate.password) {
                employeeUpdate.password = Encryption.encrypt(employeeUpdate.password);
            }

            if (employeeUpdate.access_token) {
                employeeUpdate.access_token = Encryption.encrypt(employeeUpdate.access_token);
            }

            if (employeeUpdate.refresh_token) {
                employeeUpdate.refresh_token = Encryption.encrypt(employeeUpdate.refresh_token);
            }

            await Employee.update({ _id: employeeId }, employeeUpdate, { new: true });
            return response.status(202).json("Employee updated!");
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

// Resource: Employee => Device
router.route("/:id/device/").post(Token.authenticate, bodyParser.json(), async (request, response) => {
    try {
        if (await Token.authorize(["employee"], request, false)) {
            const employeeId = request.params.id;
            const deviceObj = request.body;

            await Employee.update(
                { _id: employeeId },
                { $push: { devices: deviceObj } },
            );

            return response.status(201).json("Device created!");
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(400).json(error.toString());
    }
});

// Resource: Employee => Device
router.route("/:id/device/:device_id").put(Token.authenticate, bodyParser.json(), async (request, response) => {
    try {
        if (await Token.authorize(["employee"], request, false)) {
            const employeeId = request.params.id;
            const deviceId = request.params.device_id;
            const deviceUpdate = request.body;

            await Employee.update(
                {
                    "_id": employeeId,
                    "devices._id": deviceId,
                },
                {
                    "devices.$.battery": deviceUpdate.battery,
                    "devices.$.id": deviceUpdate.id,
                    "devices.$.last_sync_time": deviceUpdate.last_sync_time,
                    "devices.$.type": deviceUpdate.type,
                    "devices.$.version": deviceUpdate.version,
                },
            );

            return response.status(202).json("Device updated!");
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

// Resource: Employee => Device
router.route("/:id/device/:device_id").delete(Token.authenticate, bodyParser.json(), async (request, response) => {
    try {
        if (await Token.authorize(["employee"], request, false)) {
            const employeeId = request.params.id;
            const deviceId = request.params.device_id;

            await Employee.update(
                {
                    "_id": employeeId,
                    "devices._id": deviceId,
                },
                {
                    $pull: { devices: { _id: deviceId } },
                },
            );

            return response.status(202).json("Device deleted!");
        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

export default router;

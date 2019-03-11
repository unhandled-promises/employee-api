import * as express from "express";
import Employee from "../employee/employee.model";
import Fitbit from "../util/fitbit";
const moment = require("moment");
const router = express.Router();
import Token from "../util/auth";

router.route("/").get(Token.authenticate, async (request, response) => {
    try {
        if (await Token.authorize(["customer"], request, true)) {
            const customerId = request.query.companyId;
            const employees = await Employee.find({ company: customerId });
            let promises: any[] = [];

            employees.map((employee) => {
                const today = moment().format("YYYY-MM-DD");
                promises.push(Fitbit.callFitbit(employee, `activities/date/${today}.json`));
            });

            const results = await Promise.all(promises);
            return response.status(200).json(results);

        } else {
            throw Error("No Access");
        }
    } catch (error) {
        return response.status(404).json(error.toString());
    }
});

export default router;

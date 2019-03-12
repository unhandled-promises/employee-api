import axios from "axios";
import { Document } from "mongoose";
import { App } from "../../types/index";
import Encryption from "../util/crypto";

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document { }

export default class Fitbit {

    public static callFitbit = async (employee: IEmployeeDoc, endpoint: string) => {

        if (employee.access_token) {
            employee.access_token = Encryption.decrypt(employee.access_token);
        }
        const authStr = `Bearer ${employee.access_token}`;
        const config = {
            headers: {
                Authorization: authStr,
            },
        };

        try {
            const response = await axios.get(`https://api.fitbit.com/1/user/${employee.user_id}/${endpoint}`, config);
            response.data.employeeId = employee.id;
            return response.data;
        } catch (error) {
            throw error.response.data.errors[0];
        }
    }
}

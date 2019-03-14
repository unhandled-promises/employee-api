import axios from "axios";
import { Document } from "mongoose";
import { App } from "../../types/index";
import Employee from "../employee/employee.model";
import Encryption from "../util/crypto";

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document { }

export default class Fitbit {

    public static callFitbit = async (employeeId: string, endpoint: string) => {

        console.log("in callFitbit...employeeId is: ", employeeId);
        let employee = await Employee.findById(employeeId);
        employee = employee.toObject();
        console.log("employee: ", employee);

        if (employee.access_token) {
            employee.access_token = Encryption.decrypt(employee.access_token);
        }
        console.log("accessToken: ", employee.access_token);
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
            const errorType = error.response.data.errors[0].errorType;
            if (errorType === "expired_token") {
                try {
                    console.log("Token expired. Aquiring a new access token");
                    const updatedTokenInfo = await Fitbit.replaceExpiredToken(employee.refresh_token, employeeId);
                    const updatedAccessToken = updatedTokenInfo.access_token;
                    const retryResponse = await Fitbit.retryFitbitCall(updatedAccessToken, employeeId, endpoint);
                    return retryResponse.data;
                } catch (error) {
                    return error.response.data.errors[0];
                }
            } else {
                return error.response.data.errors[0];
            }
        }
    }

    private static retryFitbitCall = async (accessToken: string, userId: string, endpoint: string) => {

        const authStr = `Bearer ${accessToken}`;
        const config = {
            headers: {
                Authorization: authStr,
            },
        };
        try {
            const response = await axios.get(`https://api.fitbit.com/1/user/${userId}/${endpoint}`, config);
            return response.data;
        } catch (error) {
            return error.response.data.errors[0];
        }
    }

    private static replaceExpiredToken = async (refreshToken: string, employeeId: string) => {
        const config = {
            headers: {
                accept: "application/json",
                auth: {
                    password: process.env.FITBIT_OAUTH_CLIENT_SECRET,
                    username: process.env.FITBIT_OAUTH_CLIENT_ID,
                },
            },
        };
        try {
            const response = await axios.post(`https://api.fitbit.com/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}`, config);
            const updatedAccessToken = response.data.access_token;
            const updatedRefreshToken = response.data.refresh_token;
            await Fitbit.updateEmployee(employeeId, updatedAccessToken, updatedRefreshToken);
            return response.data;
        } catch (error) {
            return error.response.data.errors[0];
        }
    }

    private static updateEmployee = async (employeeId: string, accessToken: string, refreshToken: string) => {

        const employeeUpdate = {
            access_token: accessToken,
            refresh_token: refreshToken,
        };

        if (employeeUpdate.access_token) {
            employeeUpdate.access_token = Encryption.encrypt(employeeUpdate.access_token);
        }

        if (employeeUpdate.refresh_token) {
            employeeUpdate.refresh_token = Encryption.encrypt(employeeUpdate.refresh_token);
        }

        return await Employee.update({ _id: employeeId }, employeeUpdate, { new: true });
    }
}

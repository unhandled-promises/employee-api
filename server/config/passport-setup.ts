require("dotenv").config();
import * as express from "express"
const passport = require("passport");
const FitbitStrategy = require("passport-fitbit-oauth2").FitbitOAuth2Strategy;;
const { EMPLOYEES_API } = require("../config/api-config");
import Encryption from "../util/crypto";
import Employee from "../employee/employee.model";

passport.use(new FitbitStrategy({
    clientID: process.env.FITBIT_OAUTH_CLIENT_ID,
    clientSecret: process.env.FITBIT_OAUTH_CLIENT_SECRET,
    callbackURL: `${EMPLOYEES_API}auth/fitbit/callback`,
    scope: ["activity", "heartrate", "location", , "nutrition", "profile", "settings", "sleep", "social", "weight"],
    passReqToCallback: true
},
    async (req: express.Request, accessToken: string, refreshToken: string, profile: any, done: any) => {

        const employeeId = req.query.state;

        const employeeUpdate = {
            access_token: accessToken,
            refresh_token: refreshToken,
            user_id: profile.id
        }

        if (employeeUpdate.access_token) {
            employeeUpdate.access_token = Encryption.encrypt(employeeUpdate.access_token);
        }

        if (employeeUpdate.refresh_token) {
            employeeUpdate.refresh_token = Encryption.encrypt(employeeUpdate.refresh_token);
        }

        await Employee.update({ _id: employeeId }, employeeUpdate, { new: true });
        
        done(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        });
    }
));

passport.serializeUser(function (user: any, done: any) {
    done(null, user);
});

passport.deserializeUser(function (obj: any, done: any) {
    done(null, obj);
});
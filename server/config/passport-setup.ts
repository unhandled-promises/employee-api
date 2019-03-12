// require("dotenv").config();
import * as express from "express";
import * as passport from "passport";
import { EMPLOYEES_API } from "../config/api-config";
import Employee from "../employee/employee.model";
import Encryption from "../util/crypto";
const FitbitStrategy = require("passport-fitbit-oauth2").FitbitOAuth2Strategy;

passport.use(new FitbitStrategy({
    callbackURL: `${EMPLOYEES_API}auth/fitbit/callback`,
    clientID: process.env.FITBIT_OAUTH_CLIENT_ID,
    clientSecret: process.env.FITBIT_OAUTH_CLIENT_SECRET,
    passReqToCallback: true,
    scope: ["activity", "heartrate", "location", , "nutrition", "profile", "settings", "sleep", "social", "weight"],
},
    async (req: express.Request, accessToken: string, refreshToken: string, profile: any, done: any) => {

        const employeeId = req.query.state;

        const employeeUpdate = {
            access_token: accessToken,
            avatar: profile._json.user.avatar150,
            refresh_token: refreshToken,
            user_id: profile.id,
        };

        if (employeeUpdate.access_token) {
            employeeUpdate.access_token = Encryption.encrypt(employeeUpdate.access_token);
        }

        if (employeeUpdate.refresh_token) {
            employeeUpdate.refresh_token = Encryption.encrypt(employeeUpdate.refresh_token);
        }

        await Employee.update({ _id: employeeId }, employeeUpdate, { new: true });

        done(null, {
            accessToken,
            profile,
            refreshToken,
        });
    },
));

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
});

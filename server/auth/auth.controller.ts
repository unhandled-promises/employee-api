import * as express from "express";
import * as passport from "passport";
import { USER_INTERFACE } from "../config/api-config";
const passportSetup = require("../config/passport-setup");

const router = express.Router();

router.use(passport.initialize());

const fitbitAuthenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    passport.authenticate("fitbit", {
        failureRedirect: `${USER_INTERFACE}login`,
        state: req.query.employeeId,
        successRedirect: `${USER_INTERFACE}dashboard/employee`,
    })(req, res, next);
};

router.get("/fitbit", fitbitAuthenticate);

router.get("/fitbit/callback", fitbitAuthenticate);

export default router;

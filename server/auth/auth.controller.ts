import * as express from "express";

const router = express.Router();
const passport = require('passport');
const passportSetup = require('../config/passport-setup');
const { USER_INTERFACE } = require("../config/api-config");

router.use(passport.initialize());

let fitbitAuthenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    passport.authenticate('fitbit', {
        state: req.query.employeeId,
        successRedirect: `${USER_INTERFACE}dashboard/employee`,
        failureRedirect: `${USER_INTERFACE}login`
    })(req, res, next);
};

router.get('/fitbit', fitbitAuthenticate);

router.get('/fitbit/callback', fitbitAuthenticate);

export default router;
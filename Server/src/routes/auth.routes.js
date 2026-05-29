import { Router } from "express";
import { getProfile, googleCallback, login, logout, register } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import passport from "passport";
import config from "../config/config.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

// auth routes
authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);

// google auth routes
/* 
    - first when user click on google signup btn, user will redirect to the google auth page
    - then google will send response to the callback url
    - then we will create user in our database
    - then we will send response to the client
    @route GET /api/auth/google
    @route GET /api/auth/google/callback
*/
authRouter.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get("/google/callback",
    passport.authenticate("google",  { session: false, failureRedirect: config.CLIENT_URL +"/login"}),
    googleCallback
);


// profile route
authRouter.get("/profile", authenticatedUser, getProfile);

// logout route
authRouter.get("/logout", authenticatedUser, logout);

export default authRouter;
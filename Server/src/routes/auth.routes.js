import { Router } from "express";
import { getProfile, googleCallback, login, logout, refreshToken, register, exchangeOAuthCode } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import passport from "passport";
import config from "../config/config.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import ApiError from "../utils/apiError.js";

const authRouter = Router();

function requireGoogleOAuth(req, res, next) {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
        return next(new ApiError(503, "Google authentication is not configured"));
    }
    next();
}

// auth routes
authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", verifyToken, logout);

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
    requireGoogleOAuth,
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get("/google/callback",
    requireGoogleOAuth,
    passport.authenticate("google",  { session: false, failureRedirect: config.CLIENT_URL +"/login"}),
    googleCallback
);

authRouter.post("/google/exchange", exchangeOAuthCode);


// profile route
authRouter.get("/profile", verifyToken, getProfile);

export default authRouter;

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";
import config from "./config/config.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitize client URL to prevent trailing slash mismatch errors in CORS
const clientOrigin = config.CLIENT_URL ? config.CLIENT_URL.replace(/\/$/, "") : "http://localhost:5173";

app.use(cors({
    origin: [clientOrigin, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(passport.initialize())

passport.use(
    new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    })
)

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is running." });
})

// auth routes
app.use("/api/auth", authRouter);

export default app;
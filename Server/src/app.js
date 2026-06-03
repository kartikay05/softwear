import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";
import config from "./config/config.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

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

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback'
        }, (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        })
    )
}

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            uptime: process.uptime(),
            environment: config.NODE_ENV,
        },
        message: "Server is running.",
    });
})

// auth routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.use(notFound);
app.use(errorHandler);

export default app;

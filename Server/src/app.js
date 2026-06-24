import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import adminRouter from "./routes/admin.routes.js";
import testRouter from "./routes/test.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";
import config from "./config/config.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import ApiError from "./utils/apiError.js";


const app = express();

const allowedOrigins = new Set([
    config.CLIENT_URL.replace(/\/$/, ""),
    "http://localhost:5173",
]);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
            return callback(null, true);
        }

        callback(new ApiError(403, "Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

// auth routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);
if (config.NODE_ENV !== "production") {
    app.use("/api/test", testRouter);
}


app.use(notFound);
app.use(errorHandler);

export default app;

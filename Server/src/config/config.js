import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
    throw new Error("Please provide PORT in the .env file");
}

if (!process.env.MONGO_URI) {
    throw new Error("Please provide MONGO_URI in the .env file");
}

if (!process.env.NODE_ENV) {
    throw new Error("Please provide NODE_ENV in the .env file");
}

if (!process.env.JWT_SECRET) {
    throw new Error("Please provide JWT_SECRET in the .env file");
}

if(!process.env.CLIENT_URL) {
    throw new Error("Please provide CLIENT_URL in the .env file");
}

if(!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Please provide GOOGLE_CLIENT_ID in the .env file");
}

if(!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Please provide GOOGLE_CLIENT_SECRET in the .env file");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("Please provide IMAGEKIT_PRIVATE_KEY in the .env file");
}

if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error("Please provide RAZORPAY_KEY_ID in the .env file");
}

if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Please provide RAZORPAY_KEY_SECRET in the .env file");
}


export default {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
}
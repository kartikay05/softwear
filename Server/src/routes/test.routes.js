import { Router } from "express";
import { healthCheck, testMail, testOrderMail } from "../controllers/test.controller.js";

const testRouter = Router();

testRouter.get("/health", healthCheck);
testRouter.post("/test-mail", testMail);
testRouter.post("/test-order-mail", testOrderMail);

export default testRouter;
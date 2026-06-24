import crypto from "crypto";
import Razorpay from "razorpay";
import config from "../config/config.js";

let razorpay;

export function isRazorpayConfigured() {
    return Boolean(config.RAZORPAY_KEY_ID && config.RAZORPAY_KEY_SECRET);
}

function getRazorpayClient() {
    if (!isRazorpayConfigured()) {
        throw new Error("Razorpay credentials are not configured");
    }

    if (!razorpay) {
        razorpay = new Razorpay({
            key_id: config.RAZORPAY_KEY_ID,
            key_secret: config.RAZORPAY_KEY_SECRET,
        });
    }

    return razorpay;
}

export async function createRazorpayOrder({ amount, currency = "INR", receipt, notes = {} }) {
    const client = getRazorpayClient();

    return client.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes,
    });
}

export function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (!isRazorpayConfigured()) {
        return false;
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
        .update(payload)
        .digest("hex");

    return expectedSignature === razorpaySignature;
}

export function verifyRazorpayWebhookSignature(rawBody, signature) {
    if (!config.RAZORPAY_WEBHOOK_SECRET || !signature) {
        return false;
    }

    const expectedSignature = crypto
        .createHmac("sha256", config.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

    return expectedSignature === signature;
}

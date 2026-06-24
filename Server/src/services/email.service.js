import nodemailer from "nodemailer";
import config from "../config/config.js";

let transporter;

function getTransporter() {
    if (!config.SMTP_USER || !config.SMTP_PASS) {
        return null;
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASS,
            },
        });
    }

    return transporter;
}

export async function sendMail({ to, subject, text }) {
    const mailer = getTransporter();

    if (!mailer || !to) {
        console.log("Email skipped: missing mail credentials or recipient.");
        return { skipped: true };
    }

    try {
        await mailer.sendMail({
            from: config.EMAIL_FROM,
            to,
            subject,
            text,
        });
        
        return { skipped: false };
    } catch (error) {
        console.error("Email send failed:", error.message);
        return { skipped: true, error: error.message };
    }
}

function formatCurrency(amount) {
    return `INR ${Number(amount || 0).toFixed(2)}`;
}

function formatOrderItems(order) {
    return order.items
        .map((item) => `${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}`)
        .join("\n");
}

export async function sendOrderConfirmationEmail(user, order) {
    const subject = `Softwear order confirmed - ${order._id}`;
    const text = [
        `Hi ${user.name},`,
        "",
        "Your Softwear order has been confirmed.",
        "",
        `Order ID: ${order._id}`,
        `Payment method: ${order.paymentInfo.method.toUpperCase()}`,
        `Payment status: ${order.paymentInfo.status}`,
        `Order total: ${formatCurrency(order.totalAmount)}`,
        "",
        "Items:",
        formatOrderItems(order),
        "",
        "Thank you for shopping with Softwear.",
    ].join("\n");

    return sendMail({ to: user.email, subject, text });
}

export async function sendOrderCancellationEmail(user, order) {
    const reason = order.cancellation?.reason || "No reason provided";
    const cancelledBy = order.cancellation?.cancelledBy || "system";
    const subject = `Softwear order cancelled - ${order._id}`;
    const text = [
        `Hi ${user.name},`,
        "",
        "Your Softwear order has been cancelled.",
        "",
        `Order ID: ${order._id}`,
        `Cancelled by: ${cancelledBy}`,
        `Reason: ${reason}`,
        `Order total: ${formatCurrency(order.totalAmount)}`,
        "",
        "Items:",
        formatOrderItems(order),
    ].join("\n");

    return sendMail({ to: user.email, subject, text });
}

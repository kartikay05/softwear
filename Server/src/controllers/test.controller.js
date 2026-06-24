import config from "../config/config.js";
import { sendMail, sendOrderConfirmationEmail } from "../services/email.service.js";
import asyncHandler from "../utils/asyncHandler.js";


export function healthCheck(req, res) {

    res.status(200).json({
        success: true,
        data: {
            uptime: process.uptime(),
            environment: config.NODE_ENV,
        },
        message: "Server is running.",
    });
}

export const testMail = asyncHandler(async (req, res) => {
    const { to, subject, text } = req.body;
    const result = await sendMail({ to, subject, text });

    console.log(result)

    res.status(200).json({
        message: "Email sent successfully",
        result
    });
})

export const testOrderMail = asyncHandler(async (req, res) => {

    const user = {
        name: "Kartikay",
        email: "work15763@gmail.com"
    };

    const order = {
        _id: "ORD123456",
        totalAmount: 1499,
        paymentInfo: {
            method: "card",
            status: "paid"
        },
        items: [
            {
                name: "Wireless Mouse",
                quantity: 2,
                price: 499
            },
            {
                name: "Keyboard",
                quantity: 1,
                price: 501
            }
        ]
    };

    await sendOrderConfirmationEmail(user, order);

    res.status(200).json({
        success: true,
        message: "Order confirmation email sent"
    });

})
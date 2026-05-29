import Razorpay from "razorpay";
import config from "../config/config.js";

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET,
});

export async function createOrder(amount, currency, notes){
    try{
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: currency,
            notes: notes,
            receipt: `receipt_${Date.now()}`,
        })
        return order
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function verifyPayment(paymentId, orderId, signature){
    try{
        const response = await razorpay.payments.verify({
            payment_id: paymentId,
            order_id: orderId,
            signature: signature
        })
        return response
    }
    catch(error){
        console.log(error)
        throw error
    }
}
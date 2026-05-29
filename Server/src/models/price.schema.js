import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ["INR", "USD", "EUR", "GBP"],
        default: "INR",
    },
    
},
{
    timestamps: true,
}
)


export default priceSchema;
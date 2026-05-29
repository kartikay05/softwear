import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import priceSchema from "../models/price.schema.js";
import mongoose from "mongoose";
import { variantPriceCalculate } from "../services/price.service.js";


export async function addToCart(req, res){
    const {productId, variantId, quantity} = req.body;
    const user = req.user;

    try{
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({message: "Product not found", sucess: false});
        }
        const variant = product.variants.id(variantId);
        if(!variant){
            return res.status(404).json({message: "Variant not found", sucess: false});
        }
        const cart = await cartModel.findOne({user: user._id});
        if(!cart){
            const cart = new cartModel({
                user: user._id,
                items: [{
                    product: productId,
                    variant: variantId,
                    quantity: quantity,
                    price: variant.price
                }]
            })
            await cart.save();
            return res.status(200).json({message: "Product added to cart", sucess: true, cart});
        }
        const item = cart.items.find(item => item.variant.toString() === variantId.toString());
        if(item){
            item.quantity += quantity;
            await cart.save();
            return res.status(200).json({message: "Product added to cart", sucess: true, cart});
        }
        cart.items.push({
            product: productId,
            variant: variantId,
            quantity: quantity,
            price: variant.price
        });
        await cart.save();
        return res.status(200).json({message: "Product added to cart", sucess: true, cart});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error", sucess: false});
    }
}
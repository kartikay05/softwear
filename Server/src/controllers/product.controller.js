import productModel from "../models/product.model";
import { uploadFile } from "../services/storage.service";

export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    try {
        const images = await Promise.all(req.files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: `${file.originalname}_${Date.now()}`,
                folder: 'products'
            });
        }))

        const product = await productModel.create({
            title,
            description,
            seller,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR",
            },
            images,
            seller: seller._id
        })

        res.status(201).json({
            message: "Product created successfully",
            sucess: true,
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", sucess: false });
    }
}

export async function updateProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    try {

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", sucess: false });
    }
}


export async function getAllProducts(req, res){
    const products = await productModel.find().populate('seller', 'name email');

    if(!products){
        return res.status(404).json({message: "No products found", sucess: false});
    }

    return res.status(200).json({
        message: "Products fetched successfully",
        sucess: true,
        products
    })
}

export async function getProductDetails(req, res){
    const {id} = req.params;
    const product = await productModel.findById(id).populate('seller', 'name email');

    if(!product){
        return res.status(404).json({message: "Product not found", sucess: false});
    }

    return res.status(200).json({
        message: "Product fetched successfully",
        sucess: true,
        product
    })
}

export async function deleteProduct(req, res){
    const {id} = req.params;
    const product = await productModel.findByIdAndDelete(id);

    if(!product){
        return res.status(404).json({message: "Product not found", sucess: false});
    }

    return res.status(200).json({
        message: "Product deleted successfully",
        sucess: true,
        product
    })
}

export async function addProductVariant(req, res) {

    const productId = req.params.productId;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files;
    const images = [];
    if (files || files.length !== 0) {
        (await Promise.all(files.map(async (file) => {
            const image = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return image
        }))).map(image => images.push(image))
    }

    const price = req.body.priceAmount
    const stock = req.body.stock
    const attributes = JSON.parse(req.body.attributes || "{}")

    console.log(price)

    product.variants.push({
        images,
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save();

    return res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    })

}
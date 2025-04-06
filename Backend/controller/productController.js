import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { productModel } from '../models/productModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        
        const image = req.file; 

        
        if (!image) {
            return res.status(400).json({ success: false, message: 'Image is required.' });
        }

        
        const imageDirectory = path.join(process.cwd(), 'uploads', 'product-images');

        
        if (!fs.existsSync(imageDirectory)) {
            fs.mkdirSync(imageDirectory, { recursive: true });
        }

        
        const imageName = `${Date.now()}-${image.originalname}`;
        const imagePath = path.join(imageDirectory, imageName);

        
        fs.copyFileSync(image.path, imagePath);

        
        fs.unlinkSync(image.path);

        
        const imageUrl = `/uploads/product-images/${imageName}`;

        
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl, 
            date: Date.now()
        };

        console.log(productData);

        
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added to the Database" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product remove succesfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }

}
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.params;  
        const product = await productModel.findById(productId);  

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });  
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });  
    }
}
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

export { addProduct, removeProduct, listProduct, singleProduct }
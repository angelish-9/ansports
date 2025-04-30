import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { productModel } from '../models/productModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, sizes, bestseller, canRent } = req.body;


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
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now(),
            canRent
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

const categoryProduct = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await productModel.find({ category });

        if (!products) {
            return res.status(404).json({ message: 'No products found for this category' });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getRandomProducts = async (req, res) => {
    try {
        const products = await productModel.aggregate([{ $sample: { size: 3 } }]);
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch random products", error });
    }
};


const editProduct = async (req, res) => {
    try {
        const { name, description, price, bestseller, sizes, category, canRent } = req.body;
        const { productId } = req.params;

        const existingProduct = await productModel.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        let imageUrl = existingProduct.image;

        // Handle new image upload
        if (req.file) {
            const imageDirectory = path.join(process.cwd(), "uploads", "product-images");
            if (!fs.existsSync(imageDirectory)) {
                fs.mkdirSync(imageDirectory, { recursive: true });
            }

            const imageName = `${Date.now()}-${req.file.originalname}`;
            const newImagePath = path.join(imageDirectory, imageName);
            const newImageUrl = `/uploads/product-images/${imageName}`;

            fs.copyFileSync(req.file.path, newImagePath);
            fs.unlinkSync(req.file.path);

            // Delete old images
            if (Array.isArray(imageUrl)) {
                imageUrl.forEach((imgPath) => {
                    const fullOldPath = path.join(process.cwd(), imgPath);
                    if (fs.existsSync(fullOldPath)) {
                        fs.unlinkSync(fullOldPath);
                    }
                });
            }

            imageUrl = [newImageUrl];
        }

        // Update fields
        existingProduct.name = name;
        existingProduct.description = description;
        existingProduct.price = Number(price);
        existingProduct.sizes = Array.isArray(sizes) ? sizes : [sizes];
        existingProduct.bestseller = bestseller === "true" || bestseller === true;
        existingProduct.category = category || existingProduct.category;
        existingProduct.canRent = canRent === "true" || canRent === true;
        existingProduct.image = imageUrl;

        await existingProduct.save();

        res.json({ success: true, message: "Product updated successfully." });
    } catch (error) {
        console.error("Edit product error:", error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

export { addProduct, removeProduct, listProduct, singleProduct, categoryProduct, getRandomProducts, editProduct }
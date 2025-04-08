import { cartModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js';

// Add item to the cart
export const addToCart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.user._id; // Assuming the user ID is available in `req.user` after authentication

        // Log incoming data for debugging
        console.log("Incoming data:", { productId, size, quantity });

        // Validate incoming data
        if (!productId || !size || !quantity) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Find or create a cart for the user
        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            // If cart does not exist, create a new one
            cart = new cartModel({ userId, items: [] });
        }

        // Check if the item already exists in the cart for the selected size
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (existingItemIndex !== -1) {
            // If the item exists, update the quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // If the item doesn't exist, add a new item
            cart.items.push({ productId, size, quantity });
        }

        // Log cart before saving for debugging
        console.log("Cart before saving:", cart);

        // Save the updated cart
        await cart.save();

        // Return the response
        res.status(200).json({ success: true, message: 'Product added to cart', cart });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get cart items for the user
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have a user ID from the auth middleware

        // Find the user's cart and populate the product details in the cart items
        const cart = await cartModel.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, cart });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const userId = req.user._id; // assuming you have a user ID from the auth middleware

        // Log the incoming request for debugging
        console.log("Removing item from cart:", { productId, size });

        // Find the user's cart
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Remove item from the cart
        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId || item.size !== size
        );

        // Save the updated cart
        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } catch (err) {
        console.error("Error occurred:", err); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

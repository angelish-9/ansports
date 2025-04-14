import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    sizes: {
        type: [String],
        required: true,
    },
    bestseller: {
        type: Boolean,
    },
    date: {
        type: Number,
        required: true,
    },
    canRent: {
        type: Boolean,
        default: false,
    },
});

export const productModel = mongoose.models.product || mongoose.model("product", productSchema);

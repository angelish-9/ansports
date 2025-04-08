import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Navbar from './../admin/Navbar';
import UserNavbar from './../Navbar';

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { productId } = useParams();
    const navigate = useNavigate();

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/product/single/${productId}`);

            if (response.data.success) {
                setProduct(response.data.product);
            } else {
                setError('Product not found');
            }
        } catch (err) {
            setError('Error fetching product data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        try {
            const cartData = {
                productId: product._id,
                size: selectedSize,
                quantity,
            };

            const response = await axios.post('http://localhost:5000/api/cart/add', cartData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Assumes user is logged in and has a token
                },
            });

            if (response.data.success) {
                alert('Product added to cart');
            } else {
                alert('Error adding product to cart');
            }
        } catch (err) {
            console.error(err);
            alert('Error adding product to cart');
        }
    };

    const handleRemoveProduct = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/product/remove',
                { id: productId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.success) {
                alert('Product removed successfully');
                navigate('/product-list');
            } else {
                alert('Error removing product');
            }
        } catch (err) {
            console.error(err);
            alert('Error removing product');
        }
    };

    if (loading) {
        return <div className="text-center text-xl font-semibold text-gray-700">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-xl font-semibold text-red-500">{error}</div>;
    }

    if (!product) {
        return <div className="text-center text-xl font-semibold text-gray-700">No product found.</div>;
    }

    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'admin';

    return (
        <>
            {isAdmin ? <Navbar /> : <UserNavbar />}
            <div className="mt-8">
                <div>
                    {userRole === 'admin' && (
                        <div className="text-right mb-6">
                            <Link
                                to={`/product/edit/${productId}`}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                            >
                                Edit Product
                            </Link>
                            <button
                                onClick={handleRemoveProduct}
                                className="ml-4 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105"
                            >
                                Remove Product
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-xl shadow-md">
                    <div className="md:w-2/3">
                        <h3 className="text-4xl font-extrabold text-gray-800">{product.name}</h3>
                        <p className="text-lg text-gray-600 mt-4">{product.description}</p>
                        <p className="text-xl font-bold text-green-700 mt-6">
                            <strong>Price:</strong> ${product.price}
                        </p>

                        {product.bestseller && (
                            <span className="mt-2 inline-block bg-green-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                                Bestseller
                            </span>
                        )}

                        {/* Size Selection */}
                        <div className="mt-4">
                            <label className="block text-lg font-semibold text-gray-700">Select Size:</label>
                            <select
                                value={selectedSize}
                                onChange={handleSizeChange}
                                className="mt-2 p-2 w-full border rounded-lg"
                            >
                                <option value="">Select Size</option>
                                {product.sizes &&
                                    product.sizes.map((size, index) => (
                                        <option key={index} value={size}>
                                            {size}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Quantity Selection */}
                        <div className="mt-4">
                            <label className="block text-lg font-semibold text-gray-700">Quantity:</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                className="mt-2 p-2 w-20 border rounded-lg"
                            />
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-8 md:mt-0">
                        {product.image && product.image.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-4">Product Images</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {product.image.map((img, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:5000${img}`}
                                            alt={`Product Image ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg shadow-lg hover:scale-105 transition-all"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;

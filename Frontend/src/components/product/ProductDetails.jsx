import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from './../admin/Navbar';
import UserNavbar from './../Navbar';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [days, setDays] = useState(1);

    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'admin';

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/product/single/${productId}`);
            if (res.data.success) {
                setProduct(res.data.product);
            } else {
                setError('Product not found');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!selectedSize) return alert('Please select a size');

        try {
            const res = await axios.post(
                'http://localhost:5000/api/cart/add',
                {
                    productId: product._id,
                    size: selectedSize,
                    quantity,
                    days: product.canRent ? days : undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            res.data.success ? alert('Added to cart') : alert('Failed to add');
        } catch (err) {
            console.error(err);
            alert('Error adding to cart');
        }
    };

    const handleRemoveProduct = async () => {
        try {
            const res = await axios.post(
                'http://localhost:5000/api/product/remove',
                { id: productId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (res.data.success) {
                alert('Product removed');
                navigate('/product-list');
            } else {
                alert('Failed to remove');
            }
        } catch (err) {
            console.error(err);
            alert('Error removing product');
        }
    };

    const handleRentSubmit = async () => {
        if (!days || days < 1) return alert('Select valid days');

        try {
            await axios.post(
                'http://localhost:5000/api/rentals',
                {
                    productId: product._id,
                    days,
                    totalPrice: days * product.price,
                },
                { withCredentials: true }
            );
            alert('Rental request submitted');
            setDays(1);
        } catch (err) {
            console.error(err);
            alert('Rental failed');
        }
    };

    if (loading) return <div className="text-center text-xl text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

    const rentalTotal = product?.canRent ? days * product.price : 0;

    return (
        <>
            {isAdmin ? <Navbar /> : <UserNavbar />}
            <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
                {isAdmin && (
                    <div className="flex justify-end space-x-4 mb-6">
                        <Link
                            to={`/product/edit/${productId}`}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Edit Product
                        </Link>
                        <button
                            onClick={handleRemoveProduct}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                        >
                            Remove Product
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Images */}
                    <div className="lg:w-1/2">
                        {product?.image?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {product.image.map((img, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:5000${img}`}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-48 object-cover rounded shadow hover:scale-105 transition"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400">No images available</div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-2xl font-semibold text-green-700">${product.price}</p>

                        {product.bestseller && (
                            <span className="inline-block bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                                Bestseller
                            </span>
                        )}

                        {/* Size */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Size:</label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select Size</option>
                                {product.sizes.map((size, i) => (
                                    <option key={i} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Quantity:</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min="1"
                                className="w-24 border rounded px-3 py-2"
                            />
                        </div>

                        {/* Rent */}
                        {product.canRent && (
                            <div className="bg-gray-100 p-4 rounded">
                                <label className="font-medium text-gray-700">Days to Rent:</label>
                                <input
                                    type="number"
                                    value={days}
                                    onChange={(e) => setDays(Number(e.target.value))}
                                    min="1"
                                    className="ml-2 w-20 border rounded px-2 py-1"
                                />
                                <p className="mt-2 text-blue-600 font-semibold">
                                    Total: ${rentalTotal.toFixed(2)}
                                </p>
                                <button
                                    onClick={handleRentSubmit}
                                    className="mt-3 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                                >
                                    Rent Product
                                </button>
                            </div>
                        )}

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full mt-4 bg-green-700 text-white py-3 rounded hover:bg-green-800 text-lg"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;

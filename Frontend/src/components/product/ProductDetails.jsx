import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // To fetch the productId from the URL (for routing)

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Getting the productId from the URL using React Router
    const { productId } = useParams();
    const navigate = useNavigate();  // To navigate programmatically after product is deleted

    console.log(productId);  // Log the productId to the console for debugging

    // Fetch the single product details based on productId
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/product/single/${productId}`);  // Make GET request to backend

            if (response.data.success) {
                setProduct(response.data.product);  // Set the product data in state
            } else {
                setError('Product not found');  // Handle case where product doesn't exist
            }
        } catch (err) {
            setError('Error fetching product data');  // Handle network or server errors
            console.error(err);
        } finally {
            setLoading(false);  // Set loading to false when the request is done
        }
    };

    useEffect(() => {
        fetchProduct();  // Call fetchProduct when the component mounts or when productId changes
    }, [productId]);  // Trigger fetch again if productId changes

    if (loading) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;  // Show loading text while fetching data
    }

    if (error) {
        return <div className="text-center text-lg font-semibold text-red-500">{error}</div>;  // Show error message if fetching failed
    }

    if (!product) {
        return <div className="text-center text-lg font-semibold">No product found.</div>;  // In case product is still null
    }

    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');  // Get token from localStorage

    // Function to handle product removal
    const removeProduct = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/product/remove',
                { id: productId },
                {
                    headers: {
                        'Content-Type': 'application/json', // Updated content type for JSON data
                        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    }
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

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            {userRole === 'admin' && (
                <div className="text-right mb-4">
                    <Link
                        to={`/product/edit/${productId}`}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={removeProduct}
                        className="ml-4 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Remove Product
                    </button>
                </div>
            )}

            {/* Product Details */}
            <div className="product-details mt-6">
                {product && (
                    <>
                        <h3 className="text-3xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-lg text-gray-600">{product.description}</p>
                        <p className="text-xl font-bold text-green-600 mt-2">
                            <strong>Price:</strong> ${product.price}
                        </p>

                        {product.bestseller && (
                            <span className="text-xs text-white bg-green-500 px-3 py-1 rounded-full mt-2 inline-block">
                                Bestseller
                            </span>
                        )}

                        {/* Display the product images */}
                        {product.image && product.image.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-lg mb-2">Product Images:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        <img
                                            src={`http://localhost:5000${product.image}`}
                                            alt={`Product Image`}
                                            className="w-full h-auto object-cover rounded-lg shadow-md"
                                        />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;

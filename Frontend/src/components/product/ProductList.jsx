import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // For navigation

import Sidebar from './../admin/Sidebar';
import Navbar from './../admin/Navbar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');  // Get token from localStorage

    // Fetch the list of products
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                setError('No products found');
            }
        } catch (err) {
            setError('Error fetching products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Fetch products when component mounts
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex-1 p-8 bg-gray-100">

                    <h2 className="text-2xl mb-4">Product List</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products && products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="border p-4 rounded-lg shadow-md">
                                    {/* Display product image */}
                                    {product.image && (
                                        <img
                                            src={`http://localhost:5000${product.image}`}
                                            alt={product.name}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                    )}
                                    
                                    <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                                    <p className="text-sm">{product.description}</p>
                                    <p className="font-semibold">${product.price}</p>
                                    {product.bestseller && (
                                        <span className="text-xs text-white bg-green-500 px-2 py-1 rounded-full">
                                            Bestseller
                                        </span>
                                    )}
                                    <div className="mt-4">
                                        {/* Link to the single product details page */}
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-lg">No products available</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductList;

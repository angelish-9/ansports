import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Sidebar from "./../../components/admin/Sidebar";
import Navbar from "./../../components/admin/Navbar";

const EditProductForm = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (role !== "admin") {
            navigate("/");
        }
    }, [role, navigate]);

    const { productId } = useParams();
    console.log(productId);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sizes: [], // stays array
        bestseller: false,
        category: '',
        canRent: false,
        image: [], // update this to an array
    });

    const [newImage, setNewImage] = useState(null);

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/product/single/${productId}`);
                const product = res.data.product;
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    sizes: product.sizes,
                    bestseller: product.bestseller,
                    category: product.category,
                    canRent: product.canRent,
                    image: product.image,
                });
            } catch (error) {
                console.error('Failed to load product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'sizes') {
            setFormData(prev => ({ ...prev, sizes: value.split(',').map(s => s.trim()) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('sizes', formData.sizes.join(','));
        data.append('bestseller', formData.bestseller);
        data.append('category', formData.category);
        data.append('canRent', formData.canRent);

        if (newImage) {
            data.append('image', newImage);
        }

        try {

            const token = localStorage.getItem("token");


            await axios.put(`http://localhost:5000/api/product/${productId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            alert('Product updated successfully!');
            navigate(`/product/${productId}`);
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Error updating product.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex h-[calc(100vh-56px)]">
                <Sidebar />
                <div className="flex-1 p-8 bg-gray-100">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-md mx-auto p-4 space-y-4 border rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <input
                            type="text"
                            name="sizes"
                            placeholder="Sizes (comma-separated)"
                            value={(formData.sizes || []).join(',')}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="bestseller"
                                checked={formData.bestseller}
                                onChange={handleChange}
                            />
                            <span>Bestseller</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="canRent"
                                checked={formData.canRent}
                                onChange={handleChange}
                            />
                            <span>Can be Rented</span>
                        </label>

                        {/* Show existing image */}
                        {formData.image?.[0] && (
                            <div>
                                <p className="text-sm text-gray-600">Current Image:</p>
                                <img
                                    src={`http://localhost:5000${formData.image[0]}`}
                                    alt="Current"
                                    className="w-32 h-auto border rounded"
                                />
                            </div>
                        )}


                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full p-2 border rounded"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProductForm;

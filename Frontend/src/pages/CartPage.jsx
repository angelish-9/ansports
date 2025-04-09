import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UserNavbar from './../components/Navbar';


const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState('');
    const [editedItem, setEditedItem] = useState(null); 
    const [editedQuantity, setEditedQuantity] = useState(0); 
    const [originalQuantity, setOriginalQuantity] = useState(0); 

    const fetchCart = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/cart/get',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.data.success) {
                setCart(response.data.cart);
            } else {
                setError(response.data.message || 'Failed to fetch cart');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching the cart.');
        }
    };

    const removeItem = async (productId, size) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/cart/remove',
                { productId, size },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.data.success) {
                setCart(response.data.cart);
            } else {
                alert(response.data.message || 'Failed to remove item');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while removing the item.');
        }
    };

    const updateQuantity = async (productId, size, quantity) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/cart/update',
                { productId, size, quantity },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.data.success) {
                setCart(response.data.cart);
                setEditedItem(null); 
                setEditedQuantity(0); 
                setOriginalQuantity(0); 
            } else {
                alert(response.data.message || 'Failed to update quantity');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while updating the quantity.');
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const calculateGrandTotal = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
    };

    const handleQuantityChange = (item, newQuantity) => {
        setEditedItem(item);
        setOriginalQuantity(item.quantity); 
        setEditedQuantity(newQuantity);
    };

    const cancelEdit = () => {
        setEditedItem(null);
        setEditedQuantity(originalQuantity); 
    };

    const handleQuantityIncrease = (item) => {
        setEditedItem(item); 
        setEditedQuantity((prevQuantity) => prevQuantity + 1); 
    };

    const handleQuantityDecrease = (item) => {
        const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1; 
        setEditedItem(item); 
        setEditedQuantity(newQuantity);
    };

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <>
            <UserNavbar />

            <div className="p-4 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

                {cart && cart.items.length > 0 ? (
                    <>
                        <ul className="space-y-4 mb-6">
                            {cart.items.map((item, index) => (
                                <li key={index} className="border p-4 rounded shadow flex justify-between items-start">
                                    <div className="flex space-x-4">
                                        <img
                                            src={`http://localhost:5000${item.productId.image}`}
                                            alt={item.productId.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                                            <p>Price: ${item.productId.price}</p>
                                            <p>Size: {item.size}</p>
                                            <p className="font-semibold">
                                                Total: ${item.productId.price * item.quantity}
                                            </p>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityDecrease(item)}
                                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    -
                                                </button>
                                                <span>{editedItem && editedItem.productId._id === item.productId._id ? editedQuantity : item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityIncrease(item)}
                                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {editedItem && editedItem.productId._id === item.productId._id && (
                                                <div className="mt-2 flex space-x-4">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId._id, item.size, editedQuantity)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.productId._id, item.size)}
                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="text-right border-t pt-4">
                            <p className="text-lg font-semibold mb-2">
                                Grand Total: ${calculateGrandTotal()}
                            </p>
                            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
        </>

    );
};

export default CartPage;

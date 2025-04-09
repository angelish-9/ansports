import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UserNavbar from './../components/Navbar';


const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart items on mount
    useEffect(() => {
        axios.post(
            'http://localhost:5000/api/cart/get',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
            .then(res => {
                console.log("Cart data:", res.data);
                setCartItems(res.data.cart.items || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch cart items", err);
                setLoading(false);
            });
    }, []);

    // Update the item quantity
    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(prev =>
            prev.map(item =>
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        axios.post('http://localhost:5000/api/cart/update', {
            id: itemId,
            quantity: newQuantity,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).catch(err => {
            console.error("Failed to update item quantity", err);
        });
    };

    // Increase quantity
    const increase = (itemId, currentQuantity) => {
        updateQuantity(itemId, currentQuantity + 1);
    };

    // Decrease quantity
    const decrease = (itemId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(itemId, currentQuantity - 1);
        }
    };

    // Remove item from the cart
    const removeItem = (productId, size) => {
        axios.post(
            'http://localhost:5000/api/cart/remove',
            { productId, size },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            }
        )
            .then(res => {
                console.log('Updated cart:', res.data.cart);
                setCartItems(res.data.cart.items); // Update the cart items with the new response
            })
            .catch(err => {
                console.error("Failed to remove item", err);
            });
    };

    // Calculate total price for each item
    const calculateItemTotal = (item) => {
        return item.productId.price * item.quantity;
    };

    // Calculate grand total
    const calculateGrandTotal = () => {
        return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
    };

    // Proceed to checkout
    const proceedToCheckout = () => {
        if (cartItems.length > 0) {
            window.location.href = '/checkout'; // Redirect to checkout page
        } else {
            alert("Your cart is empty. Add items to proceed.");
        }
    };

    if (loading) return <p>Loading cart...</p>;

    return (

        <>
            <UserNavbar />
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        {cartItems.map(item => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between bg-gray-100 p-4 mb-3 rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex gap-2">
                                        <img
                                            src={`http://localhost:5000${item.productId.image}`}
                                            alt={item.productId.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-semibold">{item.productId.name}</p>
                                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            <p className="text-sm text-gray-500">Price: ${item.productId.price}</p>
                                            <p className="text-sm text-gray-500">Total: ${calculateItemTotal(item).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => decrease(item._id, item.quantity)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg">{item.quantity}</span>
                                    <button
                                        onClick={() => increase(item._id, item.quantity)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.productId._id, item.size)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="mt-6">
                            <p className="font-semibold text-lg">Grand Total: ${calculateGrandTotal().toFixed(2)}</p>
                        </div>

                        {/* Proceed to checkout button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={proceedToCheckout}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>

    );
};

export default CartPage;

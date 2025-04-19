import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from '../components/Navbar';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/order/my', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            setOrders(res.data.orders || []);
        }).catch(err => {
            console.error('Failed to load orders:', err);
        });
    }, []);

    return (
        <>
            <UserNavbar />
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">My Orders</h2>

                {orders.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg mt-10">
                        You haven't placed any orders yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order, idx) => (
                            <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 border hover:shadow-xl transition duration-300 ease-in-out">
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-green-600 mb-1">Order #{idx + 1}</h3>
                                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="mb-3 space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-700">Status:</span> 
                                        <span className={`px-3 py-1 text-xs rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {order.status}
                                        </span>
                                    </p>
                                    <p><span className="font-medium text-gray-700">Address:</span> {order.address}</p>
                                    <p><span className="font-medium text-gray-700">Phone:</span> {order.phone}</p>
                                    <p><span className="font-medium text-gray-700">Total:</span> ${order.total.toFixed(2)}</p>
                                </div>

                                <div className="border-t mt-4 pt-3">
                                    <p className="font-medium text-gray-800 mb-2">Items:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="flex items-center">
                                                <span>{item.productId.name} × {item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyOrdersPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "./../../components/admin/Sidebar";
import Navbar from "./../../components/admin/Navbar";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/order/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setOrders(res.data.orders || []);
            } catch (error) {
                console.error('Failed to load orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/order/${orderId}/status`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const renderStatusButtons = (order) => {
        if (order.status === 'Completed') {
            return <p className="text-gray-600 italic">Order is completed. No further changes allowed.</p>;
        }

        const statuses = ['Pending', 'Shipped', 'Delivered', 'Canceled', 'Completed'];

        return (
            <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                    order.status !== status && (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(order._id, status)}
                            className={`px-4 py-2 rounded text-white ${
                                status === 'Pending' ? 'bg-yellow-500' :
                                status === 'Shipped' ? 'bg-blue-500' :
                                status === 'Delivered' ? 'bg-green-500' :
                                status === 'Canceled' ? 'bg-red-500' :
                                status === 'Completed' ? 'bg-gray-700' : ''
                            }`}
                        >
                            Mark as {status}
                        </button>
                    )
                ))}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-6">
                    <h2 className="text-3xl font-semibold mb-6">All Orders</h2>

                    {orders.length === 0 ? (
                        <p className="text-gray-500">No orders found.</p>
                    ) : (
                        orders.map((order, idx) => (
                            <div key={order._id} className="border p-5 rounded-lg mb-6 shadow-md">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xl font-bold">Order #{idx + 1}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Canceled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-200 text-gray-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="space-y-1 text-gray-700">
                                    <p><strong>Customer:</strong> {order.user?.name || order.user?.email || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {order.phone}</p>
                                    <p><strong>Address:</strong> {order.address}</p>
                                    <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                                    <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                </div>

                                <ul className="mt-3 list-disc list-inside text-gray-600">
                                    {order.items.map((item, i) => (
                                        <li key={i}>
                                            {item.productId?.name || 'Deleted Product'} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4">
                                    {renderStatusButtons(order)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminOrdersPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Sidebar from "./../../components/admin/Sidebar";
import Navbar from "./../../components/admin/Navbar";

const RentalStatus = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRentals = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rental/all-rented-product', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRentals(response.data.rentals);
        } catch (err) {
            console.error('Failed to fetch rentals', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const handleStatusChange = async (rentalId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:5000/api/rental/${rentalId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setRentals((prevRentals) =>
                prevRentals.map((rental) =>
                    rental._id === rentalId ? { ...rental, status: newStatus } : rental
                )
            );

            alert('Rental status updated!');
        } catch (err) {
            console.error('Error updating status', err);
            alert('Failed to update status.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen">
                <Sidebar />

                <main className="flex-1 p-6">
                    <h2 className="text-3xl font-semibold mb-6">Admin Rental Dashboard</h2>

                    {rentals.length === 0 ? (
                        <p>No rental requests found.</p>
                    ) : (
                        <div className="space-y-4">
                            {rentals.map((rental) => (
                                <div
                                    key={rental._id}
                                    className="border p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between"
                                >

                                    <div>
                                        <h3 className="text-xl font-semibold">{rental.productId?.name}</h3>
                                        <p><span className="font-medium">Rented By:</span> {rental.userId?.name || 'Unknown User'}</p>
                                        <p>Price/Day: ${rental.productId?.price}</p>
                                        <p>Days: {rental.days}</p>
                                        <p>Total: ${rental.totalPrice}</p>
                                        <p>Status: <span className="font-bold capitalize">{rental.status}</span></p>
                                    </div>

                                    <div className="mt-4 md:mt-0">
                                        <select
                                            className="border rounded px-3 py-2"
                                            value={rental.status}
                                            onChange={(e) => handleStatusChange(rental._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default RentalStatus;

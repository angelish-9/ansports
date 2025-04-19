import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './../../components/admin/Navbar';
import Sidebar from "./../../components/admin/Sidebar";

const AdminPromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [form, setForm] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        usageLimit: '',
        expiresAt: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchPromos = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/promocode", config);
            setPromoCodes(res.data);
        } catch (err) {
            console.error("Failed to fetch promo codes", err);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.code.trim()) newErrors.code = 'Code is required.';
        if (!form.discountValue || form.discountValue <= 0) newErrors.discountValue = 'Discount must be a positive number.';
        if (form.usageLimit && form.usageLimit < 0) newErrors.usageLimit = 'Usage limit cannot be negative.';
        
        // Check if expiry date is in the past
        if (form.expiresAt && new Date(form.expiresAt) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.expiresAt = 'Cannot select a past date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/promocode/${editingId}`, form, config);
            } else {
                await axios.post("http://localhost:5000/api/promocode", form, config);
            }

            setForm({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                usageLimit: '',
                expiresAt: '',
            });
            setEditingId(null);
            fetchPromos();
        } catch (err) {
            console.error("Submit error", err);
        }
    };

    const handleEdit = (promo) => {
        setEditingId(promo._id);
        setForm({
            code: promo.code,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            usageLimit: promo.usageLimit || '',
            expiresAt: promo.expiresAt ? promo.expiresAt.slice(0, 10) : '',
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this promo code?")) {
            try {
                await axios.delete(`http://localhost:5000/api/promocode/${id}`, config);
                fetchPromos();
            } catch (err) {
                console.error("Delete error", err);
            }
        }
    };

    const todayDate = new Date().toISOString().split("T")[0];

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="p-6 max-w-4xl mx-auto w-full">
                    <h2 className="text-2xl font-semibold mb-4">{editingId ? "Edit" : "Create"} Promo Code</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <input
                                name="code"
                                placeholder="CODE"
                                value={form.code}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                            />
                            {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
                        </div>

                        <div>
                            <select
                                name="discountType"
                                value={form.discountType}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat</option>
                            </select>
                        </div>

                        <div>
                            <input
                                name="discountValue"
                                placeholder="Discount Value"
                                value={form.discountValue}
                                onChange={handleChange}
                                type="number"
                                className="p-2 border rounded w-full"
                            />
                            {errors.discountValue && <p className="text-red-600 text-sm mt-1">{errors.discountValue}</p>}
                        </div>

                        <div>
                            <input
                                name="usageLimit"
                                placeholder="Usage Limit"
                                value={form.usageLimit}
                                onChange={handleChange}
                                type="number"
                                className="p-2 border rounded w-full"
                            />
                            {errors.usageLimit && <p className="text-red-600 text-sm mt-1">{errors.usageLimit}</p>}
                        </div>

                        <div>
                            <input
                                name="expiresAt"
                                placeholder="Expires At"
                                value={form.expiresAt}
                                onChange={handleChange}
                                type="date"
                                min={todayDate}
                                className="p-2 border rounded w-full"
                            />
                            {errors.expiresAt && <p className="text-red-600 text-sm mt-1">{errors.expiresAt}</p>}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {editingId ? "Update" : "Create"}
                    </button>

                    <h2 className="text-xl font-bold mt-10 mb-2">All Promo Codes</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border mt-2 bg-white">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Code</th>
                                    <th className="p-2 border">Type</th>
                                    <th className="p-2 border">Value</th>
                                    <th className="p-2 border">Used / Limit</th>
                                    <th className="p-2 border">Expires</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promoCodes.map((promo) => (
                                    <tr key={promo._id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{promo.code}</td>
                                        <td className="p-2 border capitalize">{promo.discountType}</td>
                                        <td className="p-2 border">{promo.discountValue}</td>
                                        <td className="p-2 border">{promo.usedCount}/{promo.usageLimit || '∞'}</td>
                                        <td className="p-2 border">{promo.expiresAt ? promo.expiresAt.slice(0, 10) : 'Never'}</td>
                                        <td className="p-2 border">
                                            <button
                                                onClick={() => handleEdit(promo)}
                                                className="text-blue-600 hover:underline mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(promo._id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPromoCodes;

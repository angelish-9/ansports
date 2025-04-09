import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from './../components/Navbar';


const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the current logged-in user
        axios.get('http://localhost:5000/api/user/current', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch user data.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full border-4 border-t-4 border-blue-500 h-16 w-16"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500 text-lg">No user data found.</p>
            </div>
        );
    }

    return (
        <>
        <UserNavbar />
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-4">Your Profile</h2>
            <div className="mb-4">
                <p className="font-semibold text-lg">Name:</p>
                <p className="text-gray-700">{user.name}</p>
            </div>
            <div className="mb-4">
                <p className="font-semibold text-lg">Email:</p>
                <p className="text-gray-700">{user.email}</p>
            </div>
        </div>
        </>
    );
};

export default Profile;

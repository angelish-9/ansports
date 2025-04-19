import React from 'react';
import UserNavbar from './../components/Navbar';

const SuccessPage = () => {
    return (
        <>
            <UserNavbar />
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h2 className="text-3xl font-bold mb-4 text-green-600">Order Successful 🎉</h2>
                <p className="text-lg mb-6">Thank you for your purchase! We’re processing your order.</p>
                <a href="/" className="text-blue-500 hover:underline">Go back to Home</a>
            </div>
        </>
    );
};

export default SuccessPage;

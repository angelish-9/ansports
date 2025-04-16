import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product/random");
        setFeaturedProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchRandomProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />

      {/* Hero Section */}
      <div className="relative bg-[url('/assets/hero.jpg')] bg-cover bg-center h-[400px] flex items-center justify-center">
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
          <h1 className="text-4xl font-bold text-white">Welcome to AN Sports Zone</h1>
          <p className="text-gray-300 mt-2">Your one-stop shop for all sports gear!</p>
          <Link to="/customization" className="mt-4 inline-block bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg">
            Customize Now
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product._id} className="border rounded-lg shadow-lg p-4 text-center">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">Rs. {product.price}</p>
              <Link
                to={`/product/${product._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

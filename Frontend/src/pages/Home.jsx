import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

// Sample featured products
const featuredProducts = [
  { id: 1, name: "Football", price: 29.99, image: "../assets/football3.jpg" },
  { id: 2, name: "Basketball Shoes", price: 59.99, image: "../assets/basketball3.jpg" },
  { id: 3, name: "Tennis Racket", price: 79.99, image: "../assets/badminton3.jpeg" }
];

// Sports categories
const categories = [
  { name: "Football", image: "/assets/football3.jpg", path: "/football" },
  { name: "Basketball", image: "/assets/basketball2.jpg", path: "/basketball" },
  { name: "Cricket", image: "/assets/cricket2.jpg", path: "/cricket" },
  { name: "Tennis", image: "/assets/badminton1.jpeg", path: "/tennis" },
  { name: "Badminton", image: "/assets/badminton3.jp3g", path: "/badminton" }
];

const Home = () => {
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">Shop by Sport</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </section>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;

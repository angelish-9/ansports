import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categories = [
    "football", "basketball", "cricket", "tennis", "badminton", "golf",
    "carrom", "volleyball", "swimming", "boxing", "kabbadi", "trekking",
    "rafting", "firstaid"
  ];


  useEffect(() => {
    // Fetch token and user role from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = localStorage.getItem("user");

    if (token && role == "admin") {
      setIsAdmin(true);
    }

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav className="bg-white shadow-md sticky w-full top-0 z-50 mb-5">
      {/* Top Navbar */}
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <Link to="/" className="text-xl font-bold text-pink-600">SportsShop</Link>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
          <li><Link to="/rentals" className="hover:text-pink-600">Rentals</Link></li>
          {/* <li><Link to="/customization" className="hover:text-pink-600">Customization</Link></li> */}
          <li><Link to="/about" className="hover:text-pink-600">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-pink-600">Contact</Link></li>
          <li><Link to="/cart" className="hover:text-pink-600">Cart</Link></li>
          <li><Link to="/profile" className="hover:text-pink-600">Profile</Link></li>
          {!isLoggedIn ? (
            <li><Link to="/login" className="hover:text-pink-600">Login/Signup</Link></li>
          ) : (
            <li>
              <div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    localStorage.removeItem("user");
                    setIsLoggedIn(false);
                    setIsAdmin(false);
                  }}
                  className="hover:text-red-600"
                >
                  Logout
                </button>


              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Middle Navbar - Only visible for Admin */}
      {isAdmin && (
        <div className="bg-gray-100 shadow-sm w-full">
          <div className="container mx-auto flex justify-center space-x-6 py-2">

            <Link to="/admin" className="hover:text-pink-600">Admin Dashboard</Link>

          </div>
        </div>
      )}

      {/* Bottom Navbar (Product Categories) */}
      <div className="container mx-auto flex justify-center space-x-6 py-2">
        {categories.map((cat) => (
          <Link key={cat} to={`/product/category/${cat}`} className="hover:text-pink-600 capitalize">
            {cat}
          </Link>
        ))}
      </div>

    </nav>
  );
};

export default Navbar;

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch token and user role from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role == "admin") {
      setIsAdmin(true);
    }

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      {/* Top Navbar */}
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <Link to="/" className="text-xl font-bold text-pink-600">SportsShop</Link>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
          <li><Link to="/rentals" className="hover:text-pink-600">Rentals</Link></li>
          <li><Link to="/customization" className="hover:text-pink-600">Customization</Link></li>
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
                  localStorage.removeItem("user");
                  setIsLoggedIn(false);
                  setIsAdmin(false);
                }}
                className="hover:text-red-600"
                >
                Logout
              </button>

              <Link to="/admin" className="hover:text-pink-600">Admin Dashboard</Link>

                </div>
            </li>
          )}
        </ul>
      </div>

      {/* Middle Navbar - Only visible for Admin */}
      {isAdmin && (
        <div className="bg-gray-100 shadow-sm w-full">
          <div className="container mx-auto flex justify-center space-x-6 py-2">
            {/* <Link to="/admin/dashboard" className="hover:text-pink-600">Admin Dashboard</Link>
            <Link to="/admin/orders" className="hover:text-pink-600">Manage Orders</Link> */}
            <Link to="/product-list" className="hover:text-pink-600">Manage Products</Link>
          </div>
        </div>
      )}

      {/* Bottom Navbar (Product Categories) */}
      <div className="bg-gray-100 shadow-sm w-full">
        <div className="container mx-auto flex justify-center space-x-6 py-2">
          <Link to="/football" className="hover:text-pink-600">Football</Link>
          <Link to="/basketball" className="hover:text-pink-600">Basketball</Link>
          <Link to="/cricket" className="hover:text-pink-600">Cricket</Link>
          <Link to="/tennis" className="hover:text-pink-600">Tennis</Link>
          <Link to="/badminton" className="hover:text-pink-600">Badminton</Link>
          <Link to="/golf" className="hover:text-pink-600">Golf</Link>
          <Link to="/carrom" className="hover:text-pink-600">Carrom</Link>
          <Link to="/volleyball" className="hover:text-pink-600">Volleyball</Link>
          <Link to="/swimming" className="hover:text-pink-600">Swimming</Link>
          <Link to="/boxing" className="hover:text-pink-600">Boxing</Link>
          <Link to="/kabbadi" className="hover:text-pink-600">Kabbadi</Link>
          <Link to="/trekking" className="hover:text-pink-600">Trekking</Link>
          <Link to="/rafting" className="hover:text-pink-600">Rafting</Link>
          <Link to="/firstaid" className="hover:text-pink-600">First Aid</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import PropTypes from "prop-types";

const Navbar = ({ setToken }) => {
  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-extrabold tracking-wide">
        AN <span className="text-pink-500">Sports</span> Zone
      </h1>
      <button
        onClick={() => setToken("")}
        className="bg-pink-600 hover:bg-pink-700 transition-colors px-5 py-2 sm:px-7 sm:py-2 rounded-full text-base font-semibold shadow-lg"
      >
        Logout 🚪
      </button>
    </nav>
  );
};

Navbar.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Navbar;

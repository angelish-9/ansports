import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  if (!product) return null; // Prevent errors if product is undefined

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-pink-600 font-bold">${product.price}</span>
        <Link to={`/product/${product.id}`} className="bg-pink-600 text-white px-3 py-1 rounded-md">
          View
        </Link>
      </div>
    </div>
  );
}

// Define PropTypes to ensure correct props are passed
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;

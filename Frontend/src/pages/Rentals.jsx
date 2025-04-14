import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rentals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product/rentals');
        setProducts(response.data.products);
      } catch (err) {
        setError('Failed to fetch rental products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleInputChange = (productId, value) => {
    setFormData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        days: value,
      },
    }));
  };

  const handleSubmit = async (product) => {
    const data = formData[product._id];
    if (!data?.days) {
      alert('Please select rental days.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/rentals',
        {
          productId: product._id,
          days: data.days,
          totalPrice: product.price * parseInt(data.days),
        },
        {
          withCredentials: true, // if using cookies/session for auth
        }
      );
      alert('Rental request submitted!');
      setFormData((prev) => ({
        ...prev,
        [product._id]: { days: '' },
      }));
    } catch (err) {
      alert('Failed to submit rental request.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Rental Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p>No rental products available.</p>
        ) : (
          products.map((product) => {
            const data = formData[product._id] || {};
            const total = data.days ? product.price * parseInt(data.days) : 0;

            return (
              <div key={product._id} className="p-4 border rounded shadow-md">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-60 object-cover mb-4"
                />
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p>{product.description}</p>
                <p className="mt-2 text-lg font-bold">Price/Day: ${product.price}</p>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Rent this product</h4>

                  <select
                    className="w-full border p-2 rounded mb-2"
                    value={data.days || ''}
                    onChange={(e) => handleInputChange(product._id, e.target.value)}
                  >
                    <option value="">Select Days</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'day' : 'days'}
                      </option>
                    ))}
                  </select>

                  {data.days && (
                    <p className="mb-2">
                      Total Price: <span className="font-bold">${total}</span>
                    </p>
                  )}

                  <button
                    onClick={() => handleSubmit(product)}
                    className="bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Submit Rent Request
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Rentals;

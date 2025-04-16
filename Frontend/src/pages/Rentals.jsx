import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";

const Rentals = () => {
  const [products, setProducts] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.[0]?._id;

  // Fetch all rental products
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rental/all-rentals');
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

  // Fetch user's rentals
  useEffect(() => {
    const fetchMyRentals = async () => {
      if (!userId) return;

      try {
        const response = await axios.get('http://localhost:5000/api/rental/my-rentals', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMyRentals(response.data.rentals);
      } catch (err) {
        console.error('Failed to fetch user rentals', err);
      }
    };

    fetchMyRentals();
  }, [userId]);

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

    if (!userId) {
      alert('Login to rent products.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/rental/create-rental',
        {
          productId: product._id,
          days: data.days,
          totalPrice: product.price * parseInt(data.days),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Rental request submitted!');
      setFormData((prev) => ({
        ...prev,
        [product._id]: { days: '' },
      }));

      const newRental = {
        _id: response.data?.rental?._id || new Date().getTime(),
        productId: product,
        days: data.days,
        totalPrice: product.price * parseInt(data.days),
        status: 'Pending',
        rentedAt: new Date().toISOString(),
      };

      setMyRentals((prevRentals) => [newRental, ...prevRentals]);
    } catch (err) {
      alert('Failed to submit rental request.');
      console.error(err);
    }
  };

  const handleRemoveRental = async (rentalId) => {
    if (!userId) {
      alert('Login to remove rentals.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/rental/remove-rental/${rentalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setMyRentals((prevRentals) => prevRentals.filter((rental) => rental._id !== rentalId));
      alert('Rental removed successfully!');
    } catch (err) {
      alert('Failed to remove rental.');
      console.error(err);
    }
  };

  const formatDate = (date) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="p-4 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Rental Products */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Rental Products</h2>
          <div className="space-y-6">
            {products.length === 0 ? (
              <p>No rental products available.</p>
            ) : (
              products.map((product) => {
                const data = formData[product._id] || {};
                const total = data.days ? product.price * parseInt(data.days) : 0;

                return (
                  <div key={product._id} className="flex gap-6 p-4 border rounded shadow-md hover:bg-gray-50">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="w-1/3 h-60 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-gray-600">{product.description}</p>
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
                          className="bg-green-600 text-white py-2 px-4 rounded transition hover:bg-green-700"
                        >
                          Submit Rent Request
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: User's Rentals */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">My Rentals</h2>
          <div className="space-y-6">
            {myRentals.length === 0 ? (
              <p>You have no rentals.</p>
            ) : (
              myRentals.map((rental) => (
                <div
                  key={rental._id}
                  className={`flex gap-6 p-4 border rounded shadow-md ${
                    rental.status.toLowerCase() === 'approved'
                      ? 'bg-green-500 text-white'
                      : rental.status.toLowerCase() === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{rental.productId.name}</h3>
                    <p>Price/Day: ${rental.productId.price}</p>
                    <p>Days Rented: {rental.days}</p>
                    <p>Total Price: ${rental.totalPrice}</p>
                    <p>Status: {rental.status}</p>
                    <p>Rented At: {formatDate(rental.createdAt)}</p>

                    {rental.status.toLowerCase() !== 'approved' &&
                      rental.status.toLowerCase() !== 'rejected' && (
                        <button
                          onClick={() => handleRemoveRental(rental._id)}
                          className="bg-red-600 text-white py-2 px-4 rounded mt-4 transition hover:bg-red-700"
                        >
                          Remove Rental
                        </button>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Rentals;

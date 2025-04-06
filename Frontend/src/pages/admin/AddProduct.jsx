import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "./../../components/admin/Sidebar";
import Navbar from "./../../components/admin/Navbar";

const AddProduct = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false,
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSizeChange = (e) => {
    setProduct({ ...product, sizes: e.target.value.split(",") });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only take the first image
    setProduct({ ...product, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("subCategory", product.subCategory);
      formData.append("sizes", JSON.stringify(product.sizes));
      formData.append("bestseller", product.bestseller);

      // Append image if available
      if (product.image) {
        formData.append("image", product.image);
      }

      const token = localStorage.getItem('token');
      console.log(token);

      const response = await axios.post("http://localhost:5000/api/product/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        sizes: [],
        bestseller: false,
        image: null,
      });
    } catch (error) {
      console.error(error);
      setMessage("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 p-8 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
          {message && <p className="mb-4 text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required className="w-full p-2 border" />
            <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full p-2 border"></textarea>
            <input type="number" name="price" placeholder="Price" onChange={handleChange} required className="w-full p-2 border" />
            <input type="text" name="category" placeholder="Category" onChange={handleChange} required className="w-full p-2 border" />
            <input type="text" name="subCategory" placeholder="Sub-Category" onChange={handleChange} className="w-full p-2 border" />
            <input type="text" name="sizes" placeholder="Sizes (comma-separated)" onChange={handleSizeChange} className="w-full p-2 border" />

            <label className="block">
              Bestseller:
              <select name="bestseller" onChange={handleChange} className="w-full p-2 border mt-1">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>

            <input type="file" onChange={handleFileChange} required className="w-full" />

            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;

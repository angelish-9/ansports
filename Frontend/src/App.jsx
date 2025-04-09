import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
// import CategoryPage from "./components/CategoryCard.jsx";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
// const Orders = lazy(() => import("./pages/Orders.jsx"));
// const Rentals = lazy(() => import("./pages/Rentals.jsx"));
// const Customization = lazy(() => import("./pages/Customization.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
// const Verify = lazy(() => import("./pages/Verify.jsx"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));

const ProductDetails = lazy(() => import("./components/product/ProductDetails.jsx"));
const ProductList = lazy(() => import("./components/product/ProductList.jsx"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct.jsx"));
const CategoryProducts = lazy(() => import("./components/product/CategoryProducts.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));


function App() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* <Route path="/orders" element={<Orders />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> */}

          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />

          <Route path="product/category/:category" element={<CategoryProducts />} />

          <Route path="/cart" element={<CartPage />} />


          {/* Fallback route */}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

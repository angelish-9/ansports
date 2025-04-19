import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
// import CategoryPage from "./components/CategoryCard.jsx";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
// const Orders = lazy(() => import("./pages/Orders.jsx"));
const Rentals = lazy(() => import("./pages/Rentals.jsx"));
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
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";

const AdminMessages = lazy(() => import("./pages/admin/AdminMessages.jsx"));

const RentalStatus = lazy(() => import("./pages/admin/RentalStatus.jsx"));

const AdminPromoCodes = lazy(() => import("./pages/admin/AdminPromoCodes.jsx"));


// import MessagesPanel from './components/MessagesPanel';

import Chat from './components/Chat';


const adminId = '67f001c2c345695276466f83'



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
          <Route path="/rentals" element={<Rentals />} />

          {/* <Route path="/orders" element={<Orders />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> */}

          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails adminID={adminId} />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />

          <Route path="product/category/:category" element={<CategoryProducts />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<SuccessPage />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />

          <Route path="/chat" element={<Chat receiver={adminId} />} />

          <Route path="/admin/messages" element={<AdminMessages />} />

          <Route path="/admin/rental-status" element={<RentalStatus />} />

          <Route path="/admin/promocodes" element={<AdminPromoCodes />} />



          {/* Fallback route */}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

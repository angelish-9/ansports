import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./../../components/admin/Sidebar";
import Navbar from "./../../components/admin/Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    
    if (!token || role !== "admin") {
      navigate("/"); 
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            {/* Add admin panel components here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

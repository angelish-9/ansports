import React from "react";
import { NavLink } from "react-router-dom";
import { BiPlusCircle } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { MdList } from "react-icons/md";

const Sidebar = () => {
  return (
    <aside className="w-[20%] min-h-screen bg-gray-900 text-white border-r border-gray-800 shadow-lg">
      <div className="flex flex-col gap-4 pt-8 px-5">
        <NavLink
          className="flex items-center gap-3 px-4 py-3 rounded-md transition-all hover:bg-pink-600 hover:text-white"
          to="/admin/add-product"
        >
          <BiPlusCircle size={25} />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 px-4 py-3 rounded-md transition-all hover:bg-pink-600 hover:text-white"
          to="/product-list"
        >
          <MdList size={25} />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 px-4 py-3 rounded-md transition-all hover:bg-pink-600 hover:text-white"
          to="/admin/orders"
        >
          <HiOutlineReceiptRefund size={25} />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 px-4 py-3 rounded-md transition-all hover:bg-pink-600 hover:text-white"
          to="/admin/rental-status"
        >
          <HiOutlineReceiptRefund size={25} />
          <p className="hidden md:block">Rental Status</p>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

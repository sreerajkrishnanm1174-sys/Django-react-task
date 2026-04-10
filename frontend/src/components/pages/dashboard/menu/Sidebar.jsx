import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;
  return (
    <div className="w-64 bg-white shadow-md p-4 space-y-3">
      <h2 className="text-xl font-bold text-orange-500 mb-4">Menu</h2>

      <NavLink to="/menu/categories" className={linkClass}>
        Categories
      </NavLink>

      <NavLink to="/menu/add-item" className={linkClass}>
        Add Item
      </NavLink>

      <NavLink to="/menu/list" className={linkClass}>
        Menu List
      </NavLink>
    </div>
  );
}

export default Sidebar;

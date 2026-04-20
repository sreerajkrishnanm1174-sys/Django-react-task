import React from "react";
import Sidebar from "../menu/Sidebar";
import { NavLink, Outlet } from "react-router-dom";
import Topbar from "../../../ui/navigationbar/TopBar";

function OrderDashboard() {
  const NAV_LINKS = [
    { to: "create-order", label: "Create Order" },
    // { to: "view", label: "View Orders" },
    // { to: "", label: "Menu List" },
  ];
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;
  return (
    <>
      <div>
       <Topbar nav_links={NAV_LINKS} />
      </div>
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </>
  );
}

export default OrderDashboard;

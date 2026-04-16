import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { NavLink } from "react-router-dom";

export default function Menu() {
    const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar heading="Menu">
        <NavLink to="/menu/update" className={linkClass}>
          Update Menu
        </NavLink>

        <NavLink to="/menu/add-menu" className={linkClass}>
          Add Menu
        </NavLink>

        <NavLink to="/menu/list" className={linkClass}>
          Menu List
        </NavLink>
      </Sidebar>
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}

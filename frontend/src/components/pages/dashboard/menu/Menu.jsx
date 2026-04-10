

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Menu() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
      
    </div>
  );
}


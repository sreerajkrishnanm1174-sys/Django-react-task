import React from "react";


function Sidebar({ children, heading }) {

  return (
    <div className="w-64 bg-white shadow-md p-4 space-y-3">
      <h2 className="text-xl font-bold text-orange-500 mb-4">{heading}</h2>
      {children}
    </div>
  );
}

export default Sidebar;

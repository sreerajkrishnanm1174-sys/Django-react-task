import React from "react";

const DropdownItem = ({ label, onClick, icon, danger = false, closeMenu }) => {
  const handleClick = () => {
    onClick?.();
    closeMenu?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors
        ${danger 
          ? "text-red-600 hover:bg-red-50" 
          : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default DropdownItem;
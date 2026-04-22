import React, { useState, useRef, useEffect } from "react";

const DropdownMenu = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      
      {/* Trigger */}
      <div onClick={() => setOpen((prev) => !prev)}>
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { closeMenu: () => setOpen(false) })
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
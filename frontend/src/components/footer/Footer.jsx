import React from "react";

function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-gray-500 bg-white">
      © {new Date().getFullYear()} RestoManage. All rights reserved.
    </footer>
  );
}

export default Footer;

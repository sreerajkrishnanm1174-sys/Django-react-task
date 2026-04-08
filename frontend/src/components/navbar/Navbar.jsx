import React from "react";
import LandingBtn from "../ui/buttons/landingBtn";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate =useNavigate()
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <h1 className="text-2xl font-bold text-orange-500">RestoManage</h1>
      <div className="space-x-4">
        <LandingBtn variant="outline" onClick={() => navigate("/login")} >Login</LandingBtn>
        <LandingBtn className="bg-orange-500 hover:bg-orange-600 text-white"  onClick={() => navigate("/register")}>
          SignUp
        </LandingBtn>
      </div>
    </header>
  );
}

export default Navbar;

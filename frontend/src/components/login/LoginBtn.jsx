import React from "react";

function LoginBtn({text, onClick}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      {text}
    </button>
  );
}

export default LoginBtn;

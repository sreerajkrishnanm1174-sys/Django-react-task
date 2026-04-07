import React from "react";

function LoginInput({ label,name, type = "text", value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-yellow-700"
      />
    </div>
  );
}

export default LoginInput;

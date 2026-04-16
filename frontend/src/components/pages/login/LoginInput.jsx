import React from "react";

function LoginInput({ label,name, type = "text", value, onChange, placeholder,autoComplete, ...rest }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        name={name}
        {...rest}   
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text)]"
      />
    </div>
  );
}

export default LoginInput;

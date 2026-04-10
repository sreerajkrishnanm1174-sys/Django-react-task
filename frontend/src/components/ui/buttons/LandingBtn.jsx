import React from 'react'
import clsx from "clsx";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variants = {
  primary: "bg-orange-500 text-white hover:bg-orange-600",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  ghost: "text-gray-800 hover:bg-gray-100",
};

function LandingBtn({
  children,
  size = "md",
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={clsx(
        "rounded-xl font-medium transition duration-200",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default LandingBtn
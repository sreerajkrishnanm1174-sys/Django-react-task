import React, { useState } from "react";
import LoginInput from "../login/LoginInput";
import LoginBtn from "../login/LoginBtn";
import useSignup from "./signup";
import { Link } from "react-router-dom";

function SignUpForm() {
  const [confirmpassword, setConfirmpassword] = useState("");
  const [formData, setFormData] = React.useState({
    username: "",
    firstname: "",
    lastname: "",
    phone: "",
    bio: "",
    password: "",
  });
  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmpassword(value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { mutate, isPending, isError, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    mutate(formData);
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
        >
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-sm text-gray-500">
              Start managing your restaurant today
            </p>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <LoginInput
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First name"
            />
            <LoginInput
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>

          <LoginInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />

          <LoginInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <LoginInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />

          <LoginInput
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short bio"
          />

          <LoginInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />

          <LoginInput
            label="Confirm Password"
            name="confirmpassword"
            value={confirmpassword}
            onChange={handleConfirmPassword}
            placeholder="Confirm password"
          />

          {/* Error */}
          {isError && (
            <p className="text-sm text-red-500">
              {error?.message || "Something went wrong"}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Account"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="cursor-pointer hover:text-orange-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default SignUpForm;

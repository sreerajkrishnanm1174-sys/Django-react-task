import React, { useEffect } from "react";
import LoginInput from "./LoginInput";
import useLogin from "./Login";
import { useNavigate } from "react-router-dom";
import userAuthStore from "../../../store/userAuthstore";
import { useLocation, Link } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { mutate, isPending, isError, error, isSuccess } = useLogin();

  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: () => {
        const state = userAuthStore.getState();
        const role = state.user?.results?.[0]?.role?.role_name;

        const from = location.state?.from?.pathname;

        if (from) {
          // user came from protected route
          navigate(from, { replace: true });
        } else {
          // role-based fallback
          if (role === "chef") {
            navigate("/menu", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <h2 className="text-sm text-gray-500">Sign in to your account</h2>
          <p className="text-sm text-gray-500">
            Login to manage your restaurant
          </p>
        </div>

        {/* Username */}
        <LoginInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          autoComplete="username"
        />

        {/* Password */}
        <LoginInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        {/* Error */}
        {isError && (
          <p className="text-sm text-red-500">
            {error?.message || "Invalid credentials"}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <div className="flex justify-between text-sm text-gray-500">
          <Link
            to="/forgot-password"
            className="cursor-pointer hover:text-orange-500"
          >
            Forgot password?
          </Link>

          <Link to="/register" className="cursor-pointer hover:text-orange-500">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

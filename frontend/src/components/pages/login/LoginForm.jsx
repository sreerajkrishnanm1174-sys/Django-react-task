import React, { useEffect } from "react";
import LoginInput from "./LoginInput";
import useLogin from "./Login";
import { useNavigate, } from "react-router-dom";
import userAuthStore from "../../../store/userAuthstore";
import { useLocation, Link } from "react-router-dom";
import { LoginSchema } from "../../../schema/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginBtn from "./LoginBtn";

function LoginForm() {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error, isSuccess } = useLogin();


  const{register, handleSubmit, formState:{errors}} =useForm({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        const state = userAuthStore.getState();
        const role = state.user?.role?.role_name;
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } 
        else {
          if (role === "chef") {
            navigate("/menu", { replace: true }); 
          } else {
            navigate("/login", { replace: true });
          }
        }
      },
      onError: (error) => {
        console.error("Login failed:", error);
      } 
    });
  };  
  // const [formData, setFormData] = React.useState({
  //   email: "",
  //   password: "",
  // });
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  // const { mutate, isPending, isError, error, isSuccess } = useLogin();

  // const location = useLocation();

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   mutate(formData, {
  //     onSuccess: () => {
  //       const state = userAuthStore.getState();
  //       const role = state.user?.role?.role_name;

  //       const from = location.state?.from?.pathname;

  //       if (from) {
  //         // user came from protected route
  //         navigate(from, { replace: true });
  //       } else {
  //         // role-based fallback
  //         if (role === "chef") {
  //           navigate("/menu", { replace: true });
  //         } else {
  //           navigate("/", { replace: true });
  //         }
  //       }
  //     },
  //   });
  // };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
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

        {/* email */}
        <LoginInput
          label="email"
          name="email"
          // value={formData.email}
          type="email"
          {...register("email")}
          // onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}

        {/* Password */}
        <LoginInput
          label="Password"
          type="password"
          name="password"
          // value={formData.password}
          {...register("password")}
          // onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

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

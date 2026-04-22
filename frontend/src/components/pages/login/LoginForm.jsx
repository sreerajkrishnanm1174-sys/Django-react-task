import React from "react";
import LoginInput from "./LoginInput";
import useLogin from "./Login";
import { useNavigate, useLocation, Link } from "react-router-dom";
import userAuthStore from "../../../store/userAuthstore";
import { LoginSchema } from "../../../schema/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { set } from "zod";

const GOOGLE_LOGIN_URL = "http://127.0.0.1:8000/api/auth/google/";

function LoginForm() {
  const { setAuth } = userAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const handleGoogleLogin = () => {
    if (!window.google) {
      console.error("Google not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id:
        "1001892126357-nijum9s09n6t4icceb797hhsroofgbsv.apps.googleusercontent.com",
      callback: async (response) => {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/auth/google/", {
            method: "POST", // ✅ IMPORTANT
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: response.credential,
              id_token: response.credential,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Google login failed");
          }
          const token = data?.access; // Adjust based on your API response structure
          const user = data?.user;
          setAuth({
            user: user,
            token: token,
          });
          
          

          onSuccess();

          // console.log("SUCCESS:", data);
        } catch (err) {
          console.error(err); 
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  const onSuccess = () => {
    const state = userAuthStore.getState();
    const role = state.user?.role?.role_name;
    const from = location.state?.from?.pathname;
    // console.log("Login successful, user", state.user);
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(role === "chef" ? "/menu" : "/login", { replace: true });
    }
  };

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess,
      onError: (err) => console.error("Login failed:", err),
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your restaurant
          </p>
        </div>

        {/* Google login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          {/* Google "G" logo */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">
            or sign in with email
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email */}
        <div>
          <LoginInput
            label="Email"
            name="email"
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <LoginInput
            label="Password"
            type="password"
            name="password"
            {...register("password")}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* API error */}
        {isError && (
          <p className="text-sm text-red-500 text-center">
            {error?.message || "Invalid credentials. Please try again."}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isPending ? "Logging in…" : "Login"}
        </button>

        {/* Footer links */}
        <div className="flex justify-between text-sm text-gray-500">
          <Link
            to="/forgot-password"
            className="hover:text-orange-500 transition-colors"
          >
            Forgot password?
          </Link>
          <Link
            to="/register"
            className="hover:text-orange-500 transition-colors"
          >
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

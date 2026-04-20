import React from "react";
import LoginInput from "../login/LoginInput";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "./signup";
import { RegSchema } from "../../../schema/RegSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function SignUpForm() {
  const { mutate, isPending } = useSignup();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(RegSchema),
    defaultValues: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      bio: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

 const onSubmit = (data) => {
  const { confirmPassword, ...payload } = data;
  console.log("FORM DATA:", data);
  mutate(payload, {
    onSuccess: () => {
      alert("Signup successful! Please login.");
      navigate("/login");
    },
    onError: (err) => {
      const backendErrors = err?.response?.data;
      console.log("BACKEND ERROR:", err?.response?.data);

      if (backendErrors) {
        Object.keys(backendErrors).forEach((field) => {
          const message = Array.isArray(backendErrors[field])
            ? backendErrors[field][0]
            : backendErrors[field];

          setError(field, {
            type: "server",
            message,
          });
        });
      }
    },
  });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500">
            Start managing your restaurant today
          </p>
        </div>

        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <LoginInput
              label="First Name"
              {...register("first_name")}
              placeholder="First name"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <LoginInput
              label="Last Name"
              {...register("last_name")}
              placeholder="Last name"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Username */}
        <div>
          <LoginInput
            label="Username"
            {...register("username")}
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <LoginInput
            label="Email"
            type="email"
            {...register("email")}
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <LoginInput
            label="Phone"
            {...register("phone")}
            placeholder="Phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <LoginInput
            label="Bio"
            {...register("bio")}
            placeholder="Short bio"
          />
          {errors.bio && (
            <p className="text-red-500 text-sm">{errors.bio.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <LoginInput
            label="Password"
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <LoginInput
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
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
          <Link to="/login" className="hover:text-orange-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;

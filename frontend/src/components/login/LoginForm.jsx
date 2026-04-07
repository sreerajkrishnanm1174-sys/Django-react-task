import React from "react";
import LoginInput from "./LoginInput";
import LoginBtn from "./LoginBtn";
import useLogin from "./login";

function LoginForm() {
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const { mutate, isPending, isError, error } = useLogin();
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        mutate(formData);
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-80"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <LoginInput
        label="username"
        // type="email"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter your username"
      />

      <LoginInput
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />

      <LoginBtn text="Login" />
    </form>
  );
}

export default LoginForm;

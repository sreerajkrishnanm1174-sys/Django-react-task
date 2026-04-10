import { useMutation } from "@tanstack/react-query";
import userAuthStore from "../../../store/userAuthstore";
import { ApiFetch } from "../../../hooks/fetchapi/ApiFetch";

// src/hooks/useLogin.js
const useLogin = () => {
  const setAuth = userAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (formData) =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/token/",
        method: "POST",
        body: formData,
      }),

    onSuccess: async (data) => {
      const token = data.access;
      localStorage.setItem("access", token);

      const user = await ApiFetch({
        url: "http://127.0.0.1:8000/api/user/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuth({ user, token });

      return { user, token }; // ✅ IMPORTANT
    },
  });
};

export default useLogin;
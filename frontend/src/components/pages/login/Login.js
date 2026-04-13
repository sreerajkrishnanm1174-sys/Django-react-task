import { useMutation } from "@tanstack/react-query";
import userAuthStore from "../../../store/userAuthstore";
import { ApiFetch } from "../../../hooks/fetchapi/ApiFetch";

// src/hooks/useLogin.js
const useLogin = () => {
  const setAuth = userAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (formData) =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/login/",
        method: "POST",
        body: formData,
        headers: {}
      }),

    onSuccess: async (data) => {
      const token = data?.access; // Adjust based on your API response structure
      const user = data?.user; // Adjust based on your API response structure
      // console.log("Login successful:",data);
 

      setAuth({ user, token });

      return { user, token }; // ✅ IMPORTANT
    },
  });
};

export default useLogin;

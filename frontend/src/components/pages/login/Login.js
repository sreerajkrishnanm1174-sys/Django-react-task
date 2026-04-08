// src/hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import { ApiFetch } from "../../../hooks/fetchapi/ApiFetch";

const useLogin = () => {
  return useMutation({
    mutationFn: (formData) =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/token/",
        method: "POST",
        body: formData,
      }),

    onSuccess: (data) => {
      console.log("Login success",);

      
      // store token here
      localStorage.setItem("token", data.token);
    },

    onError: (error) => {
      console.error("Login failed", error.message);
    },
  });
};

export default useLogin;
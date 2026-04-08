import { useMutation } from "@tanstack/react-query";
import { ApiFetch } from "../../../hooks/fetchapi/ApiFetch";

const useSignup = () => {
  return useMutation({
    mutationFn: (formData) =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/register/",
        method: "POST",
        body: formData,
      }),

    onSuccess: (data) => {
      alert(" Signup success",);
      // store token here
    },

    onError: (error) => {
      alert("Signup failed", error.message);
    },
  });
};

export default useSignup;
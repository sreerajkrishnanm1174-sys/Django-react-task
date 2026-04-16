import { useMutation } from "@tanstack/react-query";
import { ApiFetch } from "../../../hooks/fetchapi/ApiFetch";

const useSignup = () => {
  return useMutation({
    mutationFn: async (formData) => {
      console.log("Signup data:", formData);

      return await ApiFetch({
        url: "http://127.0.0.1:8000/api/register/",
        method: "POST",
        body: formData, // ✅ FIXED (NOT body)
      });
    },

    onSuccess: () => {
      alert("Signup success");
    },

    onError: (error) => {
      console.log("FULL ERROR:", error);

      alert(
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      );
    },
  });
};

export default useSignup;
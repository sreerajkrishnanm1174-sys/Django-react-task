// src/hooks/useLogin.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiFetch } from "../../../hooks/fetchapi/ApiFetch";
import userAuthStore from "../../../store/userAuthstore";


const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = userAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: (formData) =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/token/",
        method: "POST",
        body: formData,
      }),

    
    onSuccess: async (data) => {
      localStorage.setItem("access", data.access);
      const token = data.access;
      // fetch user immediately
      const user =  await  ApiFetch({
        url: "http://127.0.0.1:8000/api/user/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      // store in Zustand
      setAuth({ user, token: localStorage.getItem("access") });

      // trigger refetch of user data 
      // queryClient.invalidateQueries({ queryKey: ["userdetails"] });
      
    },
    // onError: (error) => {
    // },
  });
};

export default useLogin;

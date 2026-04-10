// src/hooks/useUser.js
import { useQuery } from "@tanstack/react-query";
import { ApiFetch } from "../fetchapi/ApiFetch";

const useUser = () => {
  const token = localStorage.getItem("access");

  return useQuery({
    queryKey: ["userdetails"],
    queryFn: () =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/user/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: !!token, 
    select: (data) => data["results"][0]// only run if token exists
  });
};

export default useUser;
// src/api/apiClient.js
import axios from "axios";

export const ApiFetch = async ({ url, method = "GET", body, headers = {} }) => {
  const token = localStorage.getItem("access");

  try {
    const response = await axios({
      url,
      method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    // 🔥 Handle API errors like Django (detail)
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "API Error";

    throw new Error(message);
  }
};

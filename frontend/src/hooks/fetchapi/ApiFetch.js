// src/api/apiClient.js
import axios from "axios";

// Recursively extracts the first human-readable string from any
// Django REST Framework error shape: string | string[] | object | object[]
const extractMessage = (data) => {
  if (!data) return "API Error";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return extractMessage(data[0]);
  if (typeof data === "object") {
    // DRF detail key comes first
    if (data.detail) return extractMessage(data.detail);
    const firstValue = Object.values(data)[0];
    return extractMessage(firstValue);
  }
  return String(data);
};

export const BASE_URL = "http://127.0.0.1:8000";

export const ApiFetch = async ({
  url,
  method = "GET",
  body,
  headers = {},
  token = "",
}) => {
  try {
    const isFormData = body instanceof FormData;
    const response = await axios({
      url,
      method,
      data: body,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),

        // ✅ ONLY set JSON header when NOT FormData
        ...(!isFormData && { "Content-Type": "application/json" }),

        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      // Token expired or invalid

      // Clear auth data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect to login
      window.location.href = "/login";

      return; // stop execution
    }
    const message = extractMessage(error.response?.data);
    throw new Error(message);
  }
};

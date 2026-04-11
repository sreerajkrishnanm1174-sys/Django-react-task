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

export const ApiFetch = async ({
  url,
  method = "GET",
  body,
  headers = {},
  token = "",
}) => {
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
    const message = extractMessage(error.response?.data);
    throw new Error(message);
  }
};
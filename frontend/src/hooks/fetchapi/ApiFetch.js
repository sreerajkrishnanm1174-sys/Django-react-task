// src/api/apiClient.js
export const ApiFetch = async ({ url, method = "GET", body, headers = {} }) => {
  const token = localStorage.getItem("access"); // JWT access token

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "API Error");
  }

  return data;
};
// This file configures an Axios instance for making API requests to the scheduling backend.
// It includes interceptors for adding JWT tokens to requests and handling 401 Unauthorized responses by refreshing the token.

import axios, { AxiosError } from "axios";

// Get the base URL from session storage or window.location
const baseURL = sessionStorage.getItem("qmBaseUrl");
if (!baseURL) {
  throw new Error("Base URL not found in session storage");
}

// Extract the domain and tenant part from the original URL
const urlParts = baseURL.split("/");
const domain = `${urlParts[0]}//${urlParts[2]}`;
const tenantPart = urlParts[4];

// Construct the new base URL
const schedulingBaseURL = `${domain}/scheduling/${tenantPart}/api`;

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: schedulingBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("qmSchedulingJwtToken");
    if (token) {
      console.log("Adding token to request headers:", token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // We can get the token from the parent window if it is not available in the session storage
      // TODO: Call handleTokenRefresh() to refresh the token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401
// If a 401 Unauthorized response is received, attempt to get the token / refresh the token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("Received 401 response, attempting to refresh token...");

      await handleTokenRefresh();
    }
    return Promise.reject(error); // Let the request fail; React Query will retry it
  }
);

// Function to handle token refresh
async function handleTokenRefresh(): Promise<void> {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const newToken = await refreshToken();
      console.log("Token refreshed successfully:", newToken);
      sessionStorage.setItem("qmSchedulingJwtToken", newToken);
    } catch (refreshError) {
      console.error("Token refresh failed. Redirect to login...", refreshError);
      sessionStorage.removeItem("qmSchedulingJwtToken");
    } finally {
      isRefreshing = false;
    }
  }
}

// Function to refresh the token by calling the parent token endpoint
// Fake api to mock how to refresh a token,
// In real scenario, we need to use Portal or Lobby or Authentication Microservice for getting a new token.
async function refreshToken(): Promise<string> {
  console.log("Calling refresh token endpoint...");
  const refreshToken = sessionStorage.getItem("userRefreshToken");
  const response = await axios.get(
    `${schedulingBaseURL}/auth/token?refreshToken=${refreshToken}`
  );
  console.log("Refresh token response:", response.data);
  return response.data.token;
}

export default apiClient;

import axios, { AxiosError } from "axios";
import { getJwtTokenAsync, handleTokenRefreshAsync } from "../utils/tokenUtils";

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

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  async (config) => {
    console.log(`[API Call] ${config.method}: ${config.url}`);
    const token = await getJwtTokenAsync();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      throw new Error(
        "Token not found in session storage after refresh attempt"
      );
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401
// If a 401 Unauthorized response is received, attempt to get the token / refresh the token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("Received 401 response, attempting to refresh token...");
      await handleTokenRefreshAsync();
    }
    console.error("Response error:", error);
    return Promise.reject(error); // Let the request fail; React Query will retry it
  }
);

export default apiClient;

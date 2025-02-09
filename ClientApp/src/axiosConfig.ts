import axios from "axios";
import axiosRetry from "axios-retry";

const baseURL = sessionStorage.getItem("qmSchedulingBaseUrl");

if (!baseURL) {
  throw new Error("Base URL not found in session storage");
}

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Apply retry logic
axiosRetry(apiClient, {
  retries: 3,
  retryCondition: (error) => {
    const status = error.response?.status ?? 0;
    // Retry only if the status is not in the list of non-retry-able statuses
    return ![400, 403, 404, 409].includes(status);
  },
  retryDelay: (retryCount) => retryCount * 10000, // Spread 3 retries over 60 seconds
});

// Add a request interceptor to include the JWT token
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("qmSchedulingJwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., renew token in session storage)
      console.error("Unauthorized! Renew the token.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

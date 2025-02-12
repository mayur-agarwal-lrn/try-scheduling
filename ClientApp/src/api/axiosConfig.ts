import axios, { AxiosError } from "axios";

// Get the base URL from session storage or window.location
const baseURL = sessionStorage.getItem("qmBaseUrl");
if (!baseURL) {
  throw new Error("Base URL not found in session storage");
}

// Extract the domain and tenant part from the original URL
const urlParts = baseURL.split("/");
const domain = `${urlParts[0]}//${urlParts[2]}`;
const tenantPart = urlParts.slice(-2, -1)[0];

// Construct the new base URL
const schedulingBaseURL = `${domain}/scheduling/${tenantPart}/api/`;

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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
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
      sessionStorage.setItem("qmSchedulingJwtToken", newToken);
    } catch (refreshError) {
      console.error(
        "Token refresh failed. Redirecting to login...",
        refreshError
      );
      sessionStorage.removeItem("qmSchedulingJwtToken");
      window.location.href = "/login";
    } finally {
      isRefreshing = false;
    }
  }
}

// Function to refresh the token by calling the parent token endpoint
async function refreshToken(): Promise<string> {
  const response = await axios.get(`${baseURL}/auth/token`, {
    withCredentials: true,
  });
  return response.data.token;
}

export default apiClient;

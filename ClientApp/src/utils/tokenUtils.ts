import axios from "axios";
import jwtDecode from "jwt-decode";

const baseURL = sessionStorage.getItem("qmBaseUrl");
if (!baseURL) {
  throw new Error("Base URL not found in session storage");
}
const urlParts = baseURL.split("/");
const domain = `${urlParts[0]}//${urlParts[2]}`;
const tenantPart = urlParts[4];
const schedulingBaseURL = `${domain}/scheduling/${tenantPart}/api`;

let isRefreshing = false;

const isTokenExpired = (token: string): boolean => {
  const payload: { exp: number } = jwtDecode(token);
  const expiry = payload.exp * 1000; // Convert expiry to milliseconds (UTC)
  const isExpired = Date.now() > expiry;
  console.log("Token expiry time (UTC):", new Date(expiry).toISOString());
  return isExpired;
};

const refreshTokenAsync = async (): Promise<string> => {
  const refreshToken = sessionStorage.getItem("userRefreshToken");
  const response = await axios.get(
    `${schedulingBaseURL}/auth/token?refreshToken=${refreshToken}`
  );
  console.log("Refresh token response:", response.data);
  return response.data.token;
};

export const handleTokenRefreshAsync = async (): Promise<void> => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const newToken = await refreshTokenAsync();
      sessionStorage.setItem("qmSchedulingJwtToken", newToken);
    } catch (refreshError) {
      console.error("Token refresh failed. Redirect to login...", refreshError);
      sessionStorage.removeItem("qmSchedulingJwtToken");
    } finally {
      isRefreshing = false;
    }
  } else {
    console.log("Token refresh already in progress...");
  }
};

export const getJwtTokenAsync = async () => {
  const token = sessionStorage.getItem("qmSchedulingJwtToken");
  if (!token) {
    console.log("Token not found, refreshing token...");
    await handleTokenRefreshAsync();
  } else if (isTokenExpired(token)) {
    console.log("Token expired, refreshing token...");
    await handleTokenRefreshAsync();
  }
  return sessionStorage.getItem("qmSchedulingJwtToken");
};

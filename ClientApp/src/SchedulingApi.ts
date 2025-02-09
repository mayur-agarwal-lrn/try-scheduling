import apiClient from "./axiosConfig";

export const getScheduleList = async () => {
  try {
    const response = await apiClient.get("/scheduleList");
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Invalid data format: expected an array", response.data);
      throw new Error("Invalid data format: expected an array");
    }
  } catch (error) {
    console.error("Failed to fetch schedule data:", error);
    throw error;
  }
};

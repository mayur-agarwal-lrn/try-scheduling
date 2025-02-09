import apiClient from "./axiosConfig";

export const getScheduleList = async () => {
  try {
    const response = await apiClient.get("/scheduleList");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch schedule data:", error);
    throw error;
  }
};

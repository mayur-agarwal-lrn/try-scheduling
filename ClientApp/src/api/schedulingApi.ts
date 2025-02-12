import { Schedule } from "../types";
import apiClient from "./axiosConfig";
import { addTimezoneToDate } from "../utils/dateUtils";

// Fetch the list of schedules
// This function retrieves all schedules from the server.
export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await apiClient.get<Schedule[]>("/schedules");
  return response.data;
};

// Create a new schedule
// This function sends a new schedule to the server to be created.
export const createSchedule = async (
  newSchedule: Omit<Schedule, "id">
): Promise<Schedule> => {
  const schedule = {
    ...newSchedule,
    date: addTimezoneToDate(newSchedule.date),
  };
  const response = await apiClient.post<Schedule>("/schedules", schedule);
  return response.data;
};

// Delete a schedule by ID
// This function deletes a schedule from the server by its ID.
export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  await apiClient.delete(`/schedules/${scheduleId}`);
};

// Update a schedule by ID
// This function updates an existing schedule on the server by its ID.
export const updateSchedule = async (
  scheduleId: number,
  updates: Partial<Schedule>
): Promise<void> => {
  await apiClient.patch(`/schedules/${scheduleId}`, updates);
};

/**
 * ScheduleListContainer component is responsible for managing the state and actions
 * related to the schedule list. It uses react-query for data fetching and mutations,
 * and manages local state for processing status and error handling.
 *
 * Features:
 * - Fetches the list of schedules from the server.
 * - Handles the deletion of a schedule.
 * - Toggles the active status of a schedule.
 * - Creates a new schedule.
 * - Manages form state for creating a new schedule.
 * - Displays loading and error states.
 *
 * The component uses the ScheduleListPresenter component to render the UI.
 */

import React, { useState } from "react";
import ScheduleListPresenter from "./ScheduleListPresenter";
import { Schedule } from "../types";

import {
  getSchedules,
  deleteSchedule,
  updateSchedule,
  createSchedule,
} from "../api/schedulingApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

const ScheduleListContainer: React.FC = () => {
  const { t, i18n } = useTranslation("scheduleList");
  const queryClient = useQueryClient();

  // State for processing status on the row during an action (delete, toggle active, create)
  const [processingId, setProcessingId] = useState<number | null>(null);
  // State for showing error status on top of page after an action (delete, toggle active, create)
  const [actionError, setActionError] = useState<AxiosError | null>(null);

  // Fetch schedules using react-query
  const {
    data: scheduleList,
    isLoading: isScheduleLoading, // State to show loading status on page load
    error: schedulesGetError, // State to show error status on page load
  } = useQuery<Schedule[], AxiosError>({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });

  // Function to delete a schedule
  const performScheduleDelete = useMutation({
    mutationFn: deleteSchedule,
    onMutate: async (id: number) => {
      setProcessingId(id);
      setActionError(null);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Mock delay (not needed in production code)
    },
    onSuccess: () => {
      // Refresh the schedule list after deleting a schedule
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setProcessingId(null);
    },
    onError: (error: AxiosError) => {
      setActionError(error);
      setProcessingId(null);
    },
  });

  // Function to toggle the active status of a schedule
  const performScheduleToggleActive = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      updateSchedule(id, { active }),
    onMutate: async ({ id }: { id: number }) => {
      setProcessingId(id);
      setActionError(null);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Mock delay (not needed in production code)
    },
    onSuccess: () => {
      // Refresh the schedule list after toggling active status
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setProcessingId(null);
    },
    onError: (error: AxiosError) => {
      setActionError(error);
      setProcessingId(null);
    },
  });

  // Function to create a new schedule
  const performScheduleCreate = useMutation({
    mutationFn: createSchedule,
    onMutate: async () => {
      setProcessingId(-1); // Use -1 to indicate the create button
      setActionError(null);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Mock delay (not needed in production code)
    },
    onSuccess: () => {
      // Refresh the schedule list after creating a new schedule
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setProcessingId(null);
    },
    onError: (error: AxiosError) => {
      setActionError(error);
      setProcessingId(null);
    },
  });

  // Handle the deletion of a schedule
  const handleScheduleDelete = (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      performScheduleDelete.mutate(id);
    }
  };

  // Handle toggling the active status of a schedule
  const handleScheduleToggleActive = (id: number, active: boolean) => {
    performScheduleToggleActive.mutate({ id, active });
  };

  // State for the new schedule form
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, "id">>({
    examName: "",
    date: "",
    location: "",
    active: true,
  });

  // Handle input changes in the new schedule form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Handle the creation of a new schedule
  const handleScheduleCreate = () => {
    if (!newSchedule.examName || !newSchedule.date || !newSchedule.location) {
      alert(t("allFieldsRequired"));
      return;
    }
    performScheduleCreate.mutate(newSchedule);
    setNewSchedule({ examName: "", date: "", location: "", active: true });
  };

  const tokenExpirationSeconds = 60; // Example value, replace with actual logic

  return (
    <ScheduleListPresenter
      schedules={scheduleList}
      scheduleLoading={isScheduleLoading}
      schedulesGetError={schedulesGetError}
      onDelete={handleScheduleDelete}
      onToggleActive={handleScheduleToggleActive}
      newSchedule={newSchedule}
      onInputChange={handleInputChange}
      onCreate={handleScheduleCreate}
      processingId={processingId}
      actionError={actionError}
      tokenExpirationSeconds={tokenExpirationSeconds}
      currentLanguage={i18n.language}
    />
  );
};

export default ScheduleListContainer;

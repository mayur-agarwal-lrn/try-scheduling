import "../main.scss";
import type { Meta, StoryObj } from "@storybook/react";
import ScheduleListPresenter from "../pages/ScheduleListPresenter";
import { Schedule } from "../types";
import { AxiosError } from "axios";

// Meta configuration for the story
const meta = {
  title: "Pages/Schedule List",
  component: ScheduleListPresenter,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScheduleListPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for the stories
const mockSchedules: Schedule[] = [
  {
    id: 1,
    examName: "Math Exam",
    date: "2023-10-01T10:00",
    location: "Room 101",
    active: true,
  },
  {
    id: 2,
    examName: "Science Exam",
    date: "2023-10-02T11:00",
    location: "Room 102",
    active: false,
  },
];

// Default story configuration
export const Default: Story = {
  args: {
    schedules: mockSchedules,
    scheduleLoading: false,
    schedulesGetError: null,
    onDelete: (id: number) => console.log(`Delete schedule with id ${id}`),
    onToggleActive: (id: number, active: boolean) =>
      console.log(
        `Toggle active status for schedule with id ${id} to ${active}`
      ),
    newSchedule: { examName: "", date: "", location: "", active: true },
    onCreate: () => console.log("Create new schedule"),
    setNewSchedule: (newSchedule: React.SetStateAction<Omit<Schedule, "id">>) =>
      console.log("Set new schedule", newSchedule),
    processingId: null,
    actionError: null,
    tokenExpirationSeconds: 60,
    currentLanguage: "en",
  },
};

// Story with no data
export const NoData: Story = {
  ...Default,
  args: {
    ...Default.args,
    schedules: [],
  },
};

// Story simulating processing state
export const Processing: Story = {
  ...Default,
  args: {
    ...Default.args,
    processingId: 1, // Simulate processing state for the first schedule
  },
};

// Story simulating token expiration
export const TokenExpired: Story = {
  ...Default,
  args: {
    ...Default.args,
    tokenExpirationSeconds: 0, // Simulate token expiration
  },
};

// Story simulating an error while fetching schedules
export const SchedulesGetError: Story = {
  ...Default,
  args: {
    ...Default.args,
    schedulesGetError: new AxiosError("Failed to load schedules", "404"),
  },
};

/**
 * ScheduleListPresenter component is responsible for rendering the UI of the schedule list.
 * It displays the list of schedules, handles user interactions for creating, deleting,
 * and toggling the active status of schedules.
 *
 * Features:
 * - Displays the list of schedules with details like exam name, date, and location.
 * - Provides input fields for creating a new schedule.
 * - Handles user actions for deleting and toggling the active status of schedules.
 * - Shows loading and error states.
 * - Uses data-label attribute for responsive design in mobile view.
 *
 * The component receives props from the ScheduleListContainer component to manage state and actions.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { Schedule } from "../types";
import { AxiosError } from "axios";
import "./ScheduleListPresenter.scss";
import ErrorBox from "../components/ErrorBox";
import WarningBox from "../components/WarningBox";
import { formatDateTime } from "../utils/dateUtils";

interface ScheduleListPresenterProps {
  scheduleLoading: boolean;
  schedulesGetError: AxiosError | null;
  schedules: Schedule[] | undefined;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, active: boolean) => void;
  newSchedule: Omit<Schedule, "id">;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  actionError: AxiosError | null;
  processingId: number | null;
  tokenExpirationSeconds: number;
  currentLanguage: string;
}

const ScheduleListPresenter: React.FC<ScheduleListPresenterProps> = ({
  schedules,
  scheduleLoading,
  schedulesGetError,
  onDelete,
  onToggleActive,
  newSchedule,
  onInputChange,
  onCreate,
  processingId,
  actionError,
  tokenExpirationSeconds,
  currentLanguage,
}) => {
  const { t } = useTranslation("scheduleList");

  if (scheduleLoading) return <p>{t("loading")}</p>;
  if (schedulesGetError) return <ErrorBox error={schedulesGetError} />;
  if (!schedules || schedules.length === 0) return <p>{t("noData")}</p>;

  return (
    <div>
      <ErrorBox error={actionError} />
      <WarningBox initialSeconds={tokenExpirationSeconds} />
      <h1>{t("scheduleListHeading")}</h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>{t("examName")}</th>
            <th>{t("date")}</th>
            <th>{t("location")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="new-schedule-row">
            <td data-label={t("examName")}>
              <input
                type="text"
                name="examName"
                value={newSchedule.examName}
                onChange={onInputChange}
                placeholder={t("examName")}
              />
            </td>
            <td data-label={t("date")}>
              <input
                type="datetime-local"
                name="date"
                value={newSchedule.date}
                onChange={onInputChange}
              />
            </td>
            <td data-label={t("location")}>
              <input
                type="text"
                name="location"
                value={newSchedule.location}
                onChange={onInputChange}
                placeholder={t("location")}
              />
            </td>
            <td data-label={t("actions")}>
              <button
                onClick={onCreate}
                className="add-button"
                disabled={processingId === -1}
              >
                {t("add")}
              </button>
              {processingId === -1 && (
                <span className="processing-text">{t("processing")}</span>
              )}
            </td>
          </tr>
          {schedules.map((schedule) => (
            <tr
              key={schedule.id}
              className={schedule.id % 2 === 0 ? "even-row" : "odd-row"}
            >
              <td data-label={t("examName")}>{schedule.examName}</td>
              <td data-label={t("date")}>
                {formatDateTime(schedule.date, currentLanguage)}
              </td>
              <td data-label={t("location")}>{schedule.location}</td>
              <td data-label={t("actions")}>
                <button
                  onClick={() => onDelete(schedule.id)}
                  className="delete-button"
                  disabled={processingId === schedule.id}
                >
                  {t("delete")}
                </button>
                <button
                  onClick={() => onToggleActive(schedule.id, !schedule.active)}
                  className={
                    schedule.active ? "disable-button" : "enable-button"
                  }
                  disabled={processingId === schedule.id}
                >
                  {schedule.active ? t("disable") : t("enable")}
                </button>
                {processingId === schedule.id && (
                  <span className="processing-text">{t("processing")}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleListPresenter;

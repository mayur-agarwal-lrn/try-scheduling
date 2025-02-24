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
import styles from "./ScheduleListPresenter.module.scss";
import ErrorAlert from "../components/ErrorAlert";
import WarningAlert from "../components/WarningAlert";
import { formatDateTime } from "../utils/dateUtils";

import {
  Button as LDSButton,
  Spinner as LDSSpinner,
  FormControl as LDSFormControl,
} from "@learnosity/lds";

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
  if (schedulesGetError) return <ErrorAlert error={schedulesGetError} />;
  if (!schedules || schedules.length === 0) return <p>{t("noData")}</p>;

  return (
    <div>
      <ErrorAlert error={actionError} />
      <WarningAlert initialSeconds={tokenExpirationSeconds} />
      <h1>{t("scheduleListHeading")}</h1>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th>{t("examName")}</th>
            <th>{t("date")}</th>
            <th>{t("location")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.newScheduleRow}>
            <td data-label={t("examName")}>
              <LDSFormControl
                type="text"
                name="examName"
                value={newSchedule.examName}
                onChange={onInputChange}
                placeholder={t("examName")}
                required={true}
              />
            </td>
            <td data-label={t("date")}>
              <LDSFormControl
                type="datetime-local"
                name="date"
                value={newSchedule.date}
                onChange={onInputChange}
                required={true}
              />
            </td>
            <td data-label={t("location")}>
              <LDSFormControl
                type="text"
                name="location"
                value={newSchedule.location}
                onChange={onInputChange}
                placeholder={t("location")}
                required={true}
              />
            </td>
            <td data-label={t("actions")}>
              <LDSButton
                type="button"
                onClick={onCreate}
                variant="primary"
                size="sm"
                tabIndex={0}
                disabled={processingId === -1}
                className={styles.buttonSpacing}
              >
                {t("add")}
              </LDSButton>
              {processingId === -1 && (
                <LDSSpinner
                  animation="border"
                  role="status"
                  variant="info"
                  size="sm"
                >
                  t("processing")
                </LDSSpinner>
              )}
            </td>
          </tr>
          {schedules.map((schedule) => (
            <tr
              key={schedule.id}
              className={schedule.id % 2 === 0 ? styles.evenRow : styles.oddRow}
            >
              <td data-label={t("examName")}>{schedule.examName}</td>
              <td data-label={t("date")}>
                {formatDateTime(schedule.date, currentLanguage)}
              </td>
              <td data-label={t("location")}>{schedule.location}</td>
              <td data-label={t("actions")}>
                <LDSButton
                  type="button"
                  onClick={() => onToggleActive(schedule.id, !schedule.active)}
                  variant={schedule.active ? "outline-danger" : "success"}
                  size="sm"
                  tabIndex={1}
                  disabled={processingId === schedule.id}
                  className={styles.buttonSpacing}
                >
                  {schedule.active ? t("disable") : t("enable")}
                </LDSButton>
                <LDSButton
                  type="button"
                  onClick={() => onDelete(schedule.id)}
                  variant="danger"
                  size="sm"
                  tabIndex={2}
                  disabled={processingId === schedule.id}
                  className={styles.buttonSpacing}
                >
                  {t("delete")}
                </LDSButton>
                {processingId === schedule.id && (
                  <LDSSpinner
                    animation="border"
                    role="status"
                    variant="info"
                    size="sm"
                  >
                    t("processing")
                  </LDSSpinner>
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

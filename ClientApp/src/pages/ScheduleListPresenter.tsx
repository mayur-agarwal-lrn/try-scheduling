import React from "react";
import { useTranslation } from "react-i18next";
import { Schedule } from "../models/Schedule";

interface ScheduleListPresenterProps {
  loading: boolean;
  error: string | null;
  schedules: Schedule[];
}

const ScheduleListPresenter: React.FC<ScheduleListPresenterProps> = ({
  loading,
  error,
  schedules,
}) => {
  const { t } = useTranslation("scheduleList");

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;
  if (schedules.length === 0) return <p>{t("noData")}</p>;

  return (
    <div>
      <h1>{t("scheduleListHeading")}</h1>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            <strong>{schedule.examName}</strong> - {schedule.date} at{" "}
            {schedule.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleListPresenter;

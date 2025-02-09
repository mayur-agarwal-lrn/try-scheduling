import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getScheduleList } from "../SchedulingApi";
import { Schedule } from "../models/Schedule";

const ScheduleList: React.FC = () => {
  const { t } = useTranslation("scheduleList");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getScheduleList();
        setSchedules(data);
      } catch (err) {
        console.error(err);
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;
  if (schedules.length === 0) return <p>{t("noData")}</p>;

  return (
    <div>
      <h2>{t("scheduleListHeading")}</h2>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            <strong>{schedule.examName}</strong> - {schedule.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleList;

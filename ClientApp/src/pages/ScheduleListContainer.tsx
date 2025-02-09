import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getScheduleList } from "../SchedulingApi";
import { Schedule } from "../models/Schedule";
import ScheduleListPresenter from "./ScheduleListPresenter";

const ScheduleListContainer: React.FC = () => {
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

  return (
    <ScheduleListPresenter
      loading={loading}
      error={error}
      schedules={schedules}
    />
  );
};

export default ScheduleListContainer;

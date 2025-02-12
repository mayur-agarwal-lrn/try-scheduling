import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert as LDSAlert } from "@learnosity/lds";

interface WarningAlertProps {
  initialSeconds: number;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ initialSeconds }) => {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setExpired(true);
    }
  }, [seconds]);

  if (expired) {
    return (
      <LDSAlert variant="danger" dismissible>
        {t("tokenExpired")}
      </LDSAlert>
    );
  }

  return (
    <LDSAlert variant="warning" dismissible>
      {`${t("tokenExpireWarning")} ${seconds} ${t("seconds")}`}
    </LDSAlert>
  );
};

export default WarningAlert;

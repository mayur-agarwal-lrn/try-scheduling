import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert as LDSAlert } from "@learnosity/lds";

interface WarningAlertProps {
  initialSeconds: number;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ initialSeconds }) => {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setShowAlert(true);
      const closeTimer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Automatically close after 3 seconds
      return () => clearTimeout(closeTimer);
    }
  }, [initialSeconds, seconds]);

  if (!showAlert) {
    return null;
  }

  return (
    <LDSAlert
      variant={seconds > 0 ? "warning" : "danger"}
      dismissible
      onClose={() => setShowAlert(false)}
    >
      {seconds > 0
        ? `${t("tokenExpireWarning")} ${seconds} ${t("seconds")}`
        : t("tokenExpired")}
    </LDSAlert>
  );
};

export default WarningAlert;

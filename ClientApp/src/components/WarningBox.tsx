import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./WarningBox.scss";

interface WarningBoxProps {
  initialSeconds: number;
}

const WarningBox: React.FC<WarningBoxProps> = ({ initialSeconds }) => {
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

  return (
    <div className={`warning-box ${expired ? "expired" : ""}`}>
      {expired
        ? t("tokenExpired")
        : `${t("tokenExpireWarning")} ${seconds} ${t("seconds")}`}
    </div>
  );
};

export default WarningBox;

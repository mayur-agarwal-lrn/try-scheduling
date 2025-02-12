import React from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import "./ErrorBox.scss";

interface ErrorBoxProps {
  error: AxiosError | null;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ error }) => {
  const { t } = useTranslation("scheduleList");

  if (!error) return null;

  return (
    <div className="error-box">
      {t(error.message) + " " + (error.status && `(${error.status})`)}
    </div>
  );
};

export default ErrorBox;

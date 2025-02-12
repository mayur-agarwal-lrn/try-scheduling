import React from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import { Alert as LDSAlert } from "@learnosity/lds";

interface ErrorAlertProps {
  error: AxiosError | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  const { t } = useTranslation("scheduleList");

  if (!error) return null;

  return (
    <LDSAlert variant="danger" dismissible>
      {t(error.message) + " " + (error.status && `(${error.status})`)}
    </LDSAlert>
  );
};

export default ErrorAlert;

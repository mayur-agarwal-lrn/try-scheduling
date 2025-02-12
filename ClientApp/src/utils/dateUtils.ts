// Helper function to add browser timezone to date string
export const addTimezoneToDate = (dateString: string): string => {
  const date = new Date(dateString);
  const timezoneOffset = -date.getTimezoneOffset();
  const diff = timezoneOffset >= 0 ? "+" : "-";
  const pad = (num: number) => (num < 10 ? "0" : "") + num;
  return (
    dateString +
    diff +
    pad(Math.floor(Math.abs(timezoneOffset) / 60)) +
    ":" +
    pad(Math.abs(timezoneOffset) % 60)
  );
};

// Helper function to format date and time in the specified language
export const formatDateTime = (dateTime: string, language: string): string => {
  const date = new Date(dateTime);
  return date.toLocaleString(language);
};

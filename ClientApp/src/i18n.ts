import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const version = import.meta.env.VITE_APP_VERSION || "1.0.0";
console.log("App Version:", version);

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: ["common", "scheduleList"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: `/locales/{{lng}}/{{ns}}.json?v=${version}`, // Path to translation files with cache busting
    },
  });

export default i18n;

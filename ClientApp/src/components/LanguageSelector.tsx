import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.scss";

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language" className="language-label">
        {t("selectLanguage")}:
      </label>
      <select
        id="language"
        className="language-select"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
};

export default LanguageSelector;

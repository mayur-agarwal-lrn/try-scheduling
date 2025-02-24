import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormSelect, FormLabel as LDSFormLabel } from "@learnosity/lds";

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = language;
  }, [language, i18n]);

  return (
    <div>
      <LDSFormLabel htmlFor="selectLanguage">
        {t("selectLanguage")} :
      </LDSFormLabel>
      <FormSelect
        id="selectLanguage"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="ar">Arabic</option>
      </FormSelect>
    </div>
  );
};

export default LanguageSelector;

import "./App.scss";
import React from "react";
import { useTranslation } from "react-i18next";

import ScheduleList from "./pages/ScheduleListContainer";
import LanguageSelector from "./components/LanguageSelector";

const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="App">
      <header className="App-header">
        <h1>{t("title")}</h1>
        <LanguageSelector />
      </header>
      <main>
        <ScheduleList />
      </main>
    </div>
  );
};

export default App;

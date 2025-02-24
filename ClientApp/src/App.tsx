import styles from "./App.module.scss";
import "./i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/reactQueryClient";
import { loadCSS, ThemeProvider, Theme } from "@learnosity/lds";

import ScheduleList from "./pages/ScheduleListContainer";
import LanguageSelector from "./components/LanguageSelector";

loadCSS();

const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ThemeProvider initialTheme={Theme.dark}>
      <QueryClientProvider client={queryClient}>
        <div className={styles.App}>
          <header className={styles.AppHeader}>
            <h1>{t("title")}</h1>
            <LanguageSelector />
          </header>
          <main className={styles.Main}>
            <ScheduleList />
          </main>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

import styles from "./App.module.scss";
import "./i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/reactQueryClient";
import { loadCSS, ThemeProvider, Theme } from "@learnosity/lds";

import ScheduleList from "./pages/ScheduleListContainer";
import Header from "./components/Header";

loadCSS();

const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ThemeProvider initialTheme={Theme.dark}>
      <QueryClientProvider client={queryClient}>
        <div className={styles.App}>
          <Header title={t("title")} />
          <main className={styles.Main}>
            <ScheduleList />
          </main>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

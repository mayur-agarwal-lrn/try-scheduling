import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/reactQueryClient";
import App from "./App";

import { loadCSS, ThemeProvider } from "@learnosity/lds";
loadCSS();

// This file is the entry point for the React application. It initializes the app by rendering the root component into the DOM.
// It also sets up the QueryClientProvider for React Query and the ThemeProvider for the LDS component library.

const rootElement = document.getElementById("scheduling-root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* Provide the LDS component library to the app */}
      <ThemeProvider>
        {/* Provide the api query client to the app */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  console.error("scheduling-root element not found!");
}

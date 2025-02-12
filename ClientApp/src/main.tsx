import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/reactQueryClient";
import App from "./App";

import { loadCSS, ThemeProvider } from "@learnosity/lds";
loadCSS();

// Get the root element to render the React app
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

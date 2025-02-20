import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// This file is the entry point for the React application. It initializes the app by rendering the root component into the DOM.

const rootElement = document.getElementById("scheduling-root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("scheduling-root element not found!");
}

import type { Preview } from "@storybook/react";
import i18n from "../src/i18n"; // Ensure this file exists
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { loadCSS, ThemeProvider, Theme } from "@learnosity/lds";
import { createElement } from "react";

// Load CSS from LDS
loadCSS();

export const globalTypes = {
  locale: {
    name: "Language",
    description: "Internationalization (i18n)",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "English" },
        { value: "ar", title: "Arabic" },
        { value: "fr", title: "French" },
      ],
    },
  },
  direction: {
    name: "Text Direction",
    description: "LTR / RTL support",
    defaultValue: "ltr",
    toolbar: {
      icon: "paragraph",
      items: [
        { value: "ltr", title: "Left-to-Right" },
        { value: "rtl", title: "Right-to-Left" },
      ],
    },
  },
};

// Decorator to wrap stories with ThemeProvider
const withThemeProvider = (Story, context) => {
  return createElement(
    ThemeProvider,
    { initialTheme: Theme.light, children: createElement(Story, context) },
    createElement(Story, context)
  );
};

export const decorators = [
  (Story, context) => {
    const { locale, direction } = context.globals;

    // Change language dynamically
    i18n.changeLanguage(locale);

    // Change text direction (RTL/LTR)
    document.documentElement.dir = direction;

    return withThemeProvider(Story, context);
  },
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      element: "#root",
      config: {},
      options: {},
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS, // Includes mobile, tablet, desktop
      },
    },
  },
};

export default preview;

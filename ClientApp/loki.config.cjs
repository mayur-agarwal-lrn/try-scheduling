// This file is used to configure loki, a tool for visual regression testing.
// It specifies the configurations for different browsers and the stories to be tested.
module.exports = {
  configurations: {
    chrome: {
      target: "chrome.app", // uses locally installed Chrome
      width: 800,
      height: 600,
    },
  },
  storybookUrl: "http://localhost:6006",

  // Wait time before capturing the screenshot (in milliseconds)
  // Useful for waiting for animations or async rendering
  waitBeforeScreenshot: 3000, // 3 second

  // Maximum time to wait for a story to render before failing
  setupTimeout: 30000, // 30 seconds

  chromeFlags: ["--no-sandbox", "--disable-setuid-sandbox"],

  // Optional: retry failed comparisons by rerunning them
  diffingEngine: "pixelmatch",
  diffingEngineOptions: {
    threshold: 0.1, // adjust if your visuals are sensitive to minor changes
  },
  storiesFilter: ({ kind }) => !kind.includes("WIP"), // Optional filter
};

import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import fs from "fs";
import path from "path";

const SNAPSHOT_DIR = "./src/stories/__image_snapshots__";

export const postVisit: TestRunnerConfig["postVisit"] = async (
  page,
  context
) => {
  const storyContext = await getStoryContext(page, context);

  if (storyContext.parameters.testRunner?.skip) {
    console.log(`Skipping all tests for: ${context.id}`);
    return;
  }

  // ✅ Wait for root to be attached
  await page.waitForSelector("#storybook-root", { state: "attached" });

  // ✅ Small delay to allow CSS to finish loading
  await page.waitForTimeout(100); // Increase if needed (e.g. 200ms)

  // Run DOM snapshot test (always)
  const html = await page.$eval("#storybook-root", (el) => el.innerHTML);
  expect(html).toMatchSnapshot(`${context.id}.html`);

  // Conditionally run visual snapshot test
  if (storyContext.parameters.visualRegression?.skip) {
    console.log(`Skipping visual snapshot for: ${context.id}`);
    return;
  }

  const screenshot = await page.screenshot({ fullPage: true });
  expect(screenshot).toMatchSnapshot(`${context.id}.png`);
};

const config: TestRunnerConfig = {
  postVisit,
};

export default config;

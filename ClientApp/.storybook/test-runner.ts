// .storybook/test-runner.ts
import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // The #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandle = await page.$("#storybook-root");
    const innerHTML = await elementHandle?.innerHTML();
    expect(innerHTML).toMatchSnapshot();
  },
};

export default config;

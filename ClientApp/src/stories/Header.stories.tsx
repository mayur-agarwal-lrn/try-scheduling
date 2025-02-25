import type { Meta, StoryObj } from "@storybook/react";
import Header from "../components/Header";
import "../main.scss";

// Meta configuration for the story
const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story configuration
export const Default: Story = {
  args: {
    title: "Schedule List",
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { MetadataLoadError } from "./MetadataLoadError";

const meta: Meta<typeof MetadataLoadError> = {
  title: "Components/MetadataDialog/MetadataLoadError",
  component: MetadataLoadError,
  args: { onRetry: fn() },
};

export default meta;

export const Default: StoryObj<typeof MetadataLoadError> = {};

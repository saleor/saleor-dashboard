import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../storybook/chromatic";
import { type ModelTypeIcon } from "./constants";
import { ModelTypeIconPicker } from "./ModelTypeIconPicker";

const meta: Meta<typeof ModelTypeIconPicker> = {
  title: "Components/ModelTypeIconPicker",
  component: ModelTypeIconPicker,
  parameters: STORYBOOK_CHROMATIC_PARAMS,
  args: {
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ModelTypeIconPicker>;

export const Empty: Story = {
  args: { value: null },
};

export const Configured: Story = {
  args: { value: { name: "book-open", color: "purple" } },
};

export const Disabled: Story = {
  args: { value: { name: "book-open", color: "amber" }, disabled: true },
};

/** Picking an icon or a colour updates the trigger — the popover stays open for further edits. */
export const Interactive: StoryObj = {
  render: () => {
    const [icon, setIcon] = useState<ModelTypeIcon | null>(null);

    return <ModelTypeIconPicker value={icon} onChange={setIcon} />;
  },
};

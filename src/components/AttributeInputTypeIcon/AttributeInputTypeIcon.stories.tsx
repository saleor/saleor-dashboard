import { AttributeInputTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AttributeInputTypeIcon } from "./AttributeInputTypeIcon";
import { AttributeInputTypeLabel } from "./AttributeInputTypeLabel";
import { AttributeInputTypeTooltip } from "./AttributeInputTypeTooltip";

const meta: Meta<typeof AttributeInputTypeIcon> = {
  title: "Components/AttributeInputTypeIcon",
  component: AttributeInputTypeIcon,
};

export default meta;

type Story = StoryObj<typeof AttributeInputTypeIcon>;

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Object.values(AttributeInputTypeEnum).map(inputType => (
        <AttributeInputTypeLabel key={inputType} inputType={inputType} iconSize="xsmall" />
      ))}
    </div>
  ),
};

export const WithTooltip: Story = {
  render: () => (
    <AttributeInputTypeTooltip inputType={AttributeInputTypeEnum.NUMERIC} size="xsmall" />
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <AttributeInputTypeIcon inputType={AttributeInputTypeEnum.DROPDOWN} size="xsmall" />
      <AttributeInputTypeIcon inputType={AttributeInputTypeEnum.DROPDOWN} size="small" />
      <AttributeInputTypeIcon inputType={AttributeInputTypeEnum.DROPDOWN} size="medium" />
    </div>
  ),
};

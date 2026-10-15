import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactElement, useState } from "react";
import { fn } from "storybook/test";

import { DetailSettingRadioGroup } from "./DetailSettingRadioGroup";

type PickupOption = "disabled" | "local" | "all";

const options: Array<{
  value: PickupOption;
  label: string;
  description: string;
  badge?: ReactElement;
  disabled?: boolean;
}> = [
  {
    value: "disabled",
    label: "Off",
    description: "Customers cannot pick up orders here.",
  },
  {
    value: "local",
    label: "Local stock only",
    description: "Pickup for orders this location can fulfil from its own stock.",
    badge: (
      <Chip size="small">
        <Text size={1}>Recommended</Text>
      </Chip>
    ),
  },
  {
    value: "all",
    label: "Any warehouse",
    description: "Pickup for any order, shipped here from other warehouses first.",
  },
];

const meta: Meta<typeof DetailSettingRadioGroup<PickupOption>> = {
  title: "Components/DetailSettingRadioGroup",
  component: DetailSettingRadioGroup,
  decorators: [
    (Story: StoryFn): ReactElement => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Pickup",
    description: "Let customers collect orders from this location.",
    name: "pickup",
    value: "local",
    options,
    disabled: false,
    onValueChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof DetailSettingRadioGroup<PickupOption>>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledOption: Story = {
  args: {
    options: options.map(option =>
      option.value === "all" ? { ...option, disabled: true } : option,
    ),
  },
};

const InteractiveGroup = (): ReactElement => {
  const [value, setValue] = useState<PickupOption>("disabled");

  return (
    <DetailSettingRadioGroup<PickupOption>
      title="Pickup"
      description="Let customers collect orders from this location."
      name="pickup-interactive"
      value={value}
      options={options}
      onValueChange={setValue}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveGroup />,
};

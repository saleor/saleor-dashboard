import { Input, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { DetailSettingsCard } from "../DetailSettingsCard/DetailSettingsCard";
import { DetailSettingNestedField, DetailSettingToggleRow } from "./DetailSettingToggleRow";

const meta: Meta<typeof DetailSettingToggleRow> = {
  title: "Components / DetailSettingToggleRow",
  component: DetailSettingToggleRow,
};

export default meta;
type Story = StoryObj<typeof DetailSettingToggleRow>;

const ToggleDemo = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <DetailSettingsCard title="Orders" contentFlush>
      <DetailSettingToggleRow
        title="Allow unpaid orders"
        description="Lets checkout complete before payment succeeds. Usual for invoicing and wholesale; risky for card-only storefronts."
        pressed={pressed}
        onPressedChange={setPressed}
        testId="demo-allow-unpaid"
      />
    </DetailSettingsCard>
  );
};

const NestedDemo = () => {
  const [pressed, setPressed] = useState(true);

  return (
    <DetailSettingsCard title="Details" contentFlush>
      <DetailSettingToggleRow
        title="Expiration date"
        description="When enabled, the card stops working after this date."
        pressed={pressed}
        onPressedChange={setPressed}
        testId="demo-expiry"
      >
        {pressed ? (
          <DetailSettingNestedField>
            <Text size={3} fontWeight="medium">
              Date
            </Text>
            <Input type="date" value="2026-09-01" onChange={() => undefined} />
          </DetailSettingNestedField>
        ) : null}
      </DetailSettingToggleRow>
    </DetailSettingsCard>
  );
};

export const Default: Story = {
  render: () => <ToggleDemo />,
};

export const WithNestedField: Story = {
  render: () => <NestedDemo />,
};

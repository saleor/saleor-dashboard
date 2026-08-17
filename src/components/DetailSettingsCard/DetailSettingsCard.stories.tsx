import { Button, Input, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormattedMessage } from "react-intl";

import { DetailSettingsCard, DetailSettingsCardTitle } from "./DetailSettingsCard";

const meta: Meta<typeof DetailSettingsCard> = {
  title: "Components / DetailSettingsCard",
  component: DetailSettingsCard,
};

export default meta;
type Story = StoryObj<typeof DetailSettingsCard>;

export const Default: Story = {
  args: {
    title: "General information",
    children: <Input label="Name" value="Summer collection" />,
    "data-test-id": "detail-settings-card",
  },
};

export const WithIntro: Story = {
  args: {
    title: "Payment gateways",
    intro: (
      <Text size={3} color="default2">
        Payment apps handle provider credentials and checkout processing. Channel payment settings
        above control charge and authorization behavior.
      </Text>
    ),
    contentFlush: true,
    children: <Input label="Row inside flush content" value="Example" />,
  },
};

export const WithHeaderAction: Story = {
  args: {
    title: (
      <DetailSettingsCardTitle optional>
        <FormattedMessage defaultMessage="Background image" id="ju2zro" />
      </DetailSettingsCardTitle>
    ),
    headerEnd: (
      <Button variant="secondary" type="button">
        Upload image
      </Button>
    ),
    contentFlush: true,
    children: <Input label="Alt text" value="" />,
  },
};

export const ContentFlush: Story = {
  args: {
    title: "Payment gateways",
    contentFlush: true,
    children: <Input label="Row inside flush content" value="Example" />,
  },
};

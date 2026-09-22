import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { ChannelsAvailabilitySearchField } from "./ChannelsAvailabilitySearchField";

const meta: Meta<typeof ChannelsAvailabilitySearchField> = {
  title: "Components/ChannelsAvailabilitySearchField",
  component: ChannelsAvailabilitySearchField,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="480px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    query: "",
    onQueryChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ChannelsAvailabilitySearchField>;

const Interactive = () => {
  const [query, setQuery] = useState("");

  return <ChannelsAvailabilitySearchField query={query} onQueryChange={setQuery} />;
};

export const Default: Story = { render: () => <Interactive /> };

export const WithQuery: Story = { args: { query: "default channel" } };

export const CustomLabels: Story = {
  args: {
    label: "Find a channel",
    placeholder: "Type a channel name",
    inputTestId: "channel-search",
  },
};

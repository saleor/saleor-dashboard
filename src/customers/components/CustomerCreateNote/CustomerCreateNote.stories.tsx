import { AccountErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import CustomerCreateNote from "./CustomerCreateNote";

const meta: Meta<typeof CustomerCreateNote> = {
  title: "Customers/CustomerCreateNote",
  component: CustomerCreateNote,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    data: { note: "" },
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof CustomerCreateNote>;

const Interactive = () => {
  const [note, setNote] = useState("");

  return (
    <CustomerCreateNote
      data={{ note }}
      disabled={false}
      errors={[]}
      onChange={event => setNote(event.target.value)}
    />
  );
};

export const Default: Story = { render: () => <Interactive /> };

export const WithContent: Story = {
  args: { data: { note: "VIP customer — always ship with express delivery." } },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: {
    errors: [
      {
        __typename: "AccountError",
        code: AccountErrorCode.INVALID,
        field: "note",
        addressType: null,
        attributes: null,
        message: "Note is too long",
      },
    ],
  },
};

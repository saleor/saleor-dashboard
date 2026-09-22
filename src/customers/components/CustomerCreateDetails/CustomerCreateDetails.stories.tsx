import { AccountErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { type CustomerCreatePageFormData } from "../CustomerCreatePage/CustomerCreatePage";
import CustomerCreateDetails from "./CustomerCreateDetails";

const baseData: CustomerCreatePageFormData = {
  customerFirstName: "Ada",
  customerLastName: "Lovelace",
  email: "ada@example.com",
  note: "",
};

const meta: Meta<typeof CustomerCreateDetails> = {
  title: "Customers/CustomerCreateDetails",
  component: CustomerCreateDetails,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    data: baseData,
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof CustomerCreateDetails>;

const Interactive = () => {
  const [data, setData] = useState(baseData);

  return (
    <CustomerCreateDetails
      data={data}
      disabled={false}
      errors={[]}
      onChange={event =>
        setData(current => ({ ...current, [event.target.name]: event.target.value }))
      }
    />
  );
};

export const Default: Story = { render: () => <Interactive /> };

export const Empty: Story = {
  args: { data: { customerFirstName: "", customerLastName: "", email: "", note: "" } },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithErrors: Story = {
  args: {
    data: { customerFirstName: "", customerLastName: "", email: "nope", note: "" },
    errors: [
      {
        __typename: "AccountError",
        code: AccountErrorCode.REQUIRED,
        field: "customerFirstName",
        addressType: null,
        attributes: null,
        message: "First name is required",
      },
      {
        __typename: "AccountError",
        code: AccountErrorCode.INVALID,
        field: "email",
        addressType: null,
        attributes: null,
        message: "Enter a valid email address",
      },
    ],
  },
};

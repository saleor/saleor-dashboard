import {
  type CountryFragment,
  WarehouseErrorCode,
  type WarehouseErrorFragment,
} from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CreateWarehouseDialog } from "./CreateWarehouseDialog";

const countries: CountryFragment[] = [
  { __typename: "CountryDisplay", code: "DE", country: "Germany" },
  { __typename: "CountryDisplay", code: "PL", country: "Poland" },
  { __typename: "CountryDisplay", code: "US", country: "United States of America" },
];

const errors: WarehouseErrorFragment[] = [
  {
    __typename: "WarehouseError",
    code: WarehouseErrorCode.UNIQUE,
    field: "name",
    message: "Warehouse with this name already exists.",
  },
  {
    __typename: "WarehouseError",
    code: WarehouseErrorCode.INVALID,
    field: null,
    message: "Something went wrong.",
  },
];

const meta: Meta<typeof CreateWarehouseDialog> = {
  title: "Warehouses / CreateWarehouseDialog",
  component: CreateWarehouseDialog,
  args: {
    open: true,
    confirmButtonState: "default",
    countries,
    defaultCountryCode: "US",
    disabled: false,
    errors: [],
    onClose: fn(),
    onSubmit: fn(async (): Promise<WarehouseErrorFragment[]> => []),
  },
};

export default meta;

type Story = StoryObj<typeof CreateWarehouseDialog>;

export const Default: Story = {};

export const ForChannel: Story = {
  args: {
    channelName: "Europe",
  },
};

export const WithErrors: Story = {
  args: {
    errors,
  },
};

export const Submitting: Story = {
  args: {
    confirmButtonState: "loading",
    disabled: true,
  },
};

import { listActionsProps, pageListProps } from "@dashboard/fixtures";
import { type ShippingZoneQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ShippingMethodProducts from "./ShippingMethodProducts";

type ExcludedProducts = RelayToFlat<
  NonNullable<
    NonNullable<NonNullable<ShippingZoneQuery["shippingZone"]>["shippingMethods"]>[0]
  >["excludedProducts"]
>;

const products: ExcludedProducts = [
  { __typename: "Product", id: "1", name: "Apple Juice", thumbnail: null },
  { __typename: "Product", id: "2", name: "Banana Juice", thumbnail: null },
  { __typename: "Product", id: "3", name: "Carrot Juice", thumbnail: null },
];

const meta: Meta<typeof ShippingMethodProducts> = {
  title: "Shipping/ShippingMethodProducts",
  component: ShippingMethodProducts,
  args: {
    ...listActionsProps,
    ...pageListProps.default,
    products,
    onProductAssign: fn(),
    onProductUnassign: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ShippingMethodProducts>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selected: 2, isChecked: () => true },
};

export const Loading: Story = {
  args: { ...pageListProps.loading, products: undefined },
};

export const Empty: Story = {
  args: { products: [] },
};

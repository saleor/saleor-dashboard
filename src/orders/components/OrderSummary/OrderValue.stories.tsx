import { type OrderDetailsFragment, type OrderLinesUpdateFragment } from "@dashboard/graphql";
import { prepareMoney } from "@dashboard/orders/fixtures";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ComponentType, type ReactElement } from "react";
import { expect, fn, within } from "storybook/test";

import { OrderValue } from "./OrderValue";

type Props = ComponentProps<typeof OrderValue>;

const taxed = (
  amount: number,
  currency = "GBP",
): {
  __typename: "TaxedMoney";
  gross: { __typename: "Money"; amount: number; currency: string };
  net: { __typename: "Money"; amount: number; currency: string };
  tax: { __typename: "Money"; amount: number; currency: string };
} => ({
  __typename: "TaxedMoney",
  gross: { __typename: "Money", amount, currency },
  net: { __typename: "Money", amount, currency },
  tax: { __typename: "Money", amount: 0, currency },
});

const shippingPrice = {
  __typename: "TaxedMoney" as const,
  gross: { __typename: "Money" as const, amount: 3.95, currency: "GBP" },
};

const shippingAddress: OrderDetailsFragment["shippingAddress"] = {
  __typename: "Address",
  id: "address-1",
  city: "London",
  cityArea: "",
  companyName: "",
  country: { __typename: "CountryDisplay", code: "GB", country: "United Kingdom" },
  countryArea: "",
  firstName: "Alex",
  lastName: "Merchant",
  phone: "+44000000000",
  postalCode: "E1 6AN",
  streetAddress1: "1 Example St",
  streetAddress2: "",
};

const shippingMethod: OrderDetailsFragment["shippingMethod"] = {
  __typename: "ShippingMethod",
  id: "shipping-method-1",
};

const shippingMethods: OrderLinesUpdateFragment["shippingMethods"] = [
  {
    __typename: "ShippingMethod",
    id: "shipping-method-1",
    name: "UK Standard Delivery",
    price: { __typename: "Money", amount: 3.95, currency: "GBP" },
    active: true,
    message: null,
  },
  {
    __typename: "ShippingMethod",
    id: "shipping-method-2",
    name: "UK Express Delivery",
    price: { __typename: "Money", amount: 7.95, currency: "GBP" },
    active: true,
    message: null,
  },
];

/** Carrier apps often store raw product codes as the method name. */
export const LONG_CARRIER_METHOD_NAME =
  "UK Standard Delivery - ROYALMAILTRKNOOBA/RMTRACKEDSTDNOSIG";

const readOnlyBase = {
  orderSubtotal: taxed(5),
  shippingMethodName: "UK Standard Delivery",
  shippingPrice,
  orderTotal: taxed(8.95),
  discounts: [],
  isShippingRequired: true,
  shippingMethods: [],
  shippingMethod: null,
  lineDiscountsSummary: [],
  giftCardsAmount: null,
  usedGiftCards: null,
  displayGrossPrices: true,
  undiscountedSubtotal: 5,
  voucherId: null,
} satisfies Partial<Props>;

const editableBase = {
  ...readOnlyBase,
  isEditable: true as const,
  orderDiscount: undefined,
  addOrderDiscount: fn(),
  removeOrderDiscount: fn(),
  openDialog: fn(),
  closeDialog: fn(),
  isDialogOpen: false,
  orderDiscountAddStatus: "default" as const,
  orderDiscountRemoveStatus: "default" as const,
  undiscountedPrice: prepareMoney(8.95),
  onShippingMethodEdit: fn(),
  shippingAddress,
  shippingMethods,
  shippingMethod,
  shippingMethodName: "UK Standard Delivery",
  errors: [],
} satisfies Partial<Props>;

const meta: Meta<typeof OrderValue> = {
  title: "Orders/OrderValue",
  component: OrderValue,
  // Narrow card so ellipsis on long carrier names is visible in Storybook/Chromatic.
  decorators: [
    (Story: ComponentType): ReactElement => (
      <Box
        __maxWidth="22rem"
        padding={4}
        borderStyle="solid"
        borderWidth={1}
        borderColor="default1"
        borderRadius={3}
      >
        <Story />
      </Box>
    ),
  ],
  args: readOnlyBase as Props,
};

export default meta;
type Story = StoryObj<typeof OrderValue>;

export const ReadOnly: Story = {};

export const LongCarrierMethodName: Story = {
  args: {
    shippingMethodName: LONG_CARRIER_METHOD_NAME,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const methodName = canvas.getByTestId("shipping-method-name");

    await expect(methodName).toHaveTextContent(LONG_CARRIER_METHOD_NAME);
    await expect(methodName).toHaveAttribute("title", LONG_CARRIER_METHOD_NAME);
  },
};

export const EditableWithChange: Story = {
  args: editableBase as Props,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }): Promise<void> => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("button", { name: "Change shipping method" })).toHaveTextContent(
      "Change",
    );
    await expect(canvas.getByTestId("shipping-method-name")).toHaveTextContent(
      "UK Standard Delivery",
    );
  },
};

export const EditableLongCarrierMethodName: Story = {
  args: {
    ...(editableBase as Props),
    shippingMethodName: LONG_CARRIER_METHOD_NAME,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }): Promise<void> => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("button", { name: "Change shipping method" }),
    ).toBeInTheDocument();
    await expect(canvas.getByTestId("shipping-method-name")).toHaveAttribute(
      "title",
      LONG_CARRIER_METHOD_NAME,
    );
  },
};

export const EditableNoAlternatives: Story = {
  args: {
    ...(editableBase as Props),
    shippingMethods: [],
    isShippingRequired: false,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }): Promise<void> => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("button", { name: "Change shipping method" }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByTestId("shipping-method-name")).toHaveAttribute(
      "title",
      "UK Standard Delivery — No alternative shipping methods available",
    );
  },
};

export const EditableSetShippingMethod: Story = {
  args: {
    ...(editableBase as Props),
    shippingMethod: null,
    shippingMethodName: null,
    shippingPrice: {
      __typename: "TaxedMoney",
      gross: { __typename: "Money", amount: 0, currency: "GBP" },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }): Promise<void> => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Set shipping method")).toBeInTheDocument();
  },
};

export const EditableNoShippingAddress: Story = {
  args: {
    ...(editableBase as Props),
    shippingAddress: null,
    shippingMethod: null,
    shippingMethodName: null,
    shippingPrice: {
      __typename: "TaxedMoney",
      gross: { __typename: "Money", amount: 0, currency: "GBP" },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }): Promise<void> => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("No shipping address")).toBeInTheDocument();
  },
};

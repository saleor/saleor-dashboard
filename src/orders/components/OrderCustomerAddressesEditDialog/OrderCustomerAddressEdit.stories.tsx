import { address } from "@dashboard/fixtures";
import { type AddressFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { AddressInputOptionEnum } from "./form";
import OrderCustomerAddressEdit from "./OrderCustomerAddressEdit";

const customerAddresses: AddressFragment[] = [address];

const meta: Meta<typeof OrderCustomerAddressEdit> = {
  title: "Orders/OrderCustomerAddressEdit",
  component: OrderCustomerAddressEdit,
  args: {
    loading: false,
    customerAddresses,
    countryChoices: [{ label: "United Arab Emirates", value: "UA" }],
    addressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
    addressInputName: "shippingAddressInputOption",
    selectedCustomerAddressId: address.id,
    formAddress: {
      city: "",
      cityArea: "",
      companyName: "",
      country: "",
      countryArea: "",
      firstName: "",
      lastName: "",
      phone: "",
      postalCode: "",
      streetAddress1: "",
      streetAddress2: "",
    },
    formAddressCountryDisplayName: "",
    formErrors: [],
    onChangeAddressInputOption: fn(),
    onChangeFormAddress: fn(),
    onChangeFormAddressCountry: fn(),
    onEdit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderCustomerAddressEdit>;
type Props = ComponentProps<typeof OrderCustomerAddressEdit>;

export const CustomerAddressSelected: Story = {};

export const NewAddressSelected: Story = {
  args: { addressInputOption: AddressInputOptionEnum.NEW_ADDRESS },
};

export const Loading: Story = {
  args: { loading: true },
};

/** Without saved addresses there is nothing to pick between, so the form replaces the radios. */
export const NoCustomerAddresses: Story = {
  args: { customerAddresses: [] },
};

/** The picked option lives in the dialog form, so the radio only reports the change. */
export const PickingNewAddressReportsOption: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(canvas.getByLabelText("Add new address"));

    // Assert
    await expect(args.onChangeAddressInputOption).toHaveBeenCalledExactlyOnceWith({
      target: {
        name: "shippingAddressInputOption",
        value: AddressInputOptionEnum.NEW_ADDRESS,
      },
    });
  },
};

export const PickingCustomerAddressReportsOption: Story = {
  args: { addressInputOption: AddressInputOptionEnum.NEW_ADDRESS },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const customerAddressRadio = within(
      canvas.getByTestId(AddressInputOptionEnum.CUSTOMER_ADDRESS),
    ).getByRole("radio");

    await expect(customerAddressRadio).toHaveAttribute("aria-checked", "false");

    // Act
    await userEvent.click(customerAddressRadio);

    // Assert
    await expect(args.onChangeAddressInputOption).toHaveBeenCalledExactlyOnceWith({
      target: {
        name: "shippingAddressInputOption",
        value: AddressInputOptionEnum.CUSTOMER_ADDRESS,
      },
    });
  },
};

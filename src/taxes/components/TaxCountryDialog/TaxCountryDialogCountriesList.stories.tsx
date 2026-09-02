import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { TaxCountryDialogCountriesList } from "./TaxCountryDialogCountriesList";

const countries = [
  { id: "CA", name: "Canada" },
  { id: "DE", name: "Germany" },
  { id: "PL", name: "Poland" },
];

const meta: Meta<typeof TaxCountryDialogCountriesList> = {
  title: "Taxes/TaxCountryDialogCountriesList",
  component: TaxCountryDialogCountriesList,
  args: {
    countries,
    onSelect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TaxCountryDialogCountriesList>;
type Props = ComponentProps<typeof TaxCountryDialogCountriesList>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selectedCountryId: "DE" },
};

/** The list only reports the pick; the dialog above it holds the selection. */
export const PickingCountryCallsOnSelect: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(canvas.getByLabelText("Poland"));

    // Assert
    await expect(args.onSelect).toHaveBeenCalledExactlyOnceWith({ id: "PL", name: "Poland" });
  },
};

/** The checked row follows `selectedCountryId`, so re-picking it changes nothing. */
export const SelectedCountryIsChecked: Story = {
  args: { selectedCountryId: "DE" },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Assert
    await expect(canvas.getByLabelText("Germany")).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByLabelText("Canada")).toHaveAttribute("aria-checked", "false");

    // Act — clicking the already selected country reports nothing new
    await userEvent.click(canvas.getByLabelText("Germany"));

    // Assert
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};

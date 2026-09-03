import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { type TaxConfigurationFormData } from "../TaxChannelsPage";
import TaxSettingsCard from "./TaxSettingsCard";

const values: TaxConfigurationFormData = {
  chargeTaxes: true,
  taxCalculationStrategy: "FLAT_RATES",
  displayGrossPrices: true,
  pricesEnteredWithTax: true,
  updateCountriesConfiguration: [],
  removeCountriesConfiguration: [],
};

const meta: Meta<typeof TaxSettingsCard> = {
  title: "Taxes/TaxSettingsCard",
  component: TaxSettingsCard,
  args: {
    values,
    strategyChoices: [
      { label: "Flat rates", value: "FLAT_RATES" },
      { label: "Tax app", value: "TAX_APP" },
    ],
    strategyChoicesLoading: false,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TaxSettingsCard>;
type Props = ComponentProps<typeof TaxSettingsCard>;

export const Default: Story = {};

export const PricesEnteredWithoutTax: Story = {
  args: { values: { ...values, pricesEnteredWithTax: false } },
};

export const TaxesNotCharged: Story = {
  args: { values: { ...values, chargeTaxes: false } },
};

/** Entered prices are a boolean on the form, so the radio reports true/false, not a label. */
export const PickingPricesWithoutTaxReportsFalse: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(canvas.getByLabelText("Product prices are entered without tax"));

    // Assert
    await expect(args.onChange).toHaveBeenCalledExactlyOnceWith({
      target: { name: "pricesEnteredWithTax", value: false },
    });
  },
};

export const PickingPricesWithTaxReportsTrue: Story = {
  args: { values: { ...values, pricesEnteredWithTax: false } },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText("Product prices are entered without tax")).toHaveAttribute(
      "aria-checked",
      "true",
    );

    // Act
    await userEvent.click(canvas.getByLabelText("Product prices are entered with tax"));

    // Assert
    await expect(args.onChange).toHaveBeenCalledExactlyOnceWith({
      target: { name: "pricesEnteredWithTax", value: true },
    });
  },
};

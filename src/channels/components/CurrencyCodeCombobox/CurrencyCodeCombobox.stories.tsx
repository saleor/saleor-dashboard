import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CurrencyCodeCombobox } from "./CurrencyCodeCombobox";

const meta: Meta<typeof CurrencyCodeCombobox> = {
  title: "Channels / CurrencyCodeCombobox",
  component: CurrencyCodeCombobox,
};

export default meta;

type Story = StoryObj<typeof CurrencyCodeCombobox>;

const CurrencyCodeComboboxPlayground = (): JSX.Element => {
  const [value, setValue] = useState("PLN");

  return (
    <CurrencyCodeCombobox
      label="Currency"
      value={value}
      onChange={setValue}
      helperText="Search by code, symbol, or country."
    />
  );
};

export const Default: Story = {
  render: () => <CurrencyCodeComboboxPlayground />,
};

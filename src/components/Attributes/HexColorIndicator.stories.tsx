import { Input } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { HexColorIndicator } from "./HexColorIndicator";

const PlainTextAttributeInput = ({ value: initialValue }: { value: string }): React.ReactNode => {
  const [value, setValue] = useState(initialValue);

  return (
    <Input
      label=""
      type="text"
      size="small"
      value={value}
      onChange={event => setValue(event.target.value)}
      endAdornment={<HexColorIndicator value={value} />}
      __width={280}
    />
  );
};

const meta: Meta<typeof HexColorIndicator> = {
  title: "Components / HexColorIndicator",
  component: HexColorIndicator,
  args: {
    value: "#fafafa",
  },
  render: ({ value }: { value?: string | null }) => (
    <PlainTextAttributeInput key={value ?? ""} value={value ?? ""} />
  ),
};

export default meta;
type Story = StoryObj<typeof HexColorIndicator>;

export const LightColor: Story = {};

export const ShortHex: Story = {
  args: {
    value: "#111",
  },
};

export const WithAlpha: Story = {
  args: {
    value: "#2563eb80",
  },
};

export const NotAColor: Story = {
  args: {
    value: "Cotton, 100%",
  },
};

import { Input } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ExternalLinkAdornment } from "./ExternalLinkAdornment";

const PlainTextAttributeInput = ({ value: initialValue }: { value: string }): React.ReactNode => {
  const [value, setValue] = useState(initialValue);

  return (
    <Input
      label=""
      type="text"
      size="small"
      value={value}
      onChange={event => setValue(event.target.value)}
      endAdornment={<ExternalLinkAdornment value={value} />}
      __width={320}
    />
  );
};

const meta: Meta<typeof ExternalLinkAdornment> = {
  title: "Components / ExternalLinkAdornment",
  component: ExternalLinkAdornment,
  args: {
    value: "https://saleor.io",
  },
  render: ({ value }: { value?: string | null }) => (
    <PlainTextAttributeInput key={value ?? ""} value={value ?? ""} />
  ),
};

export default meta;
type Story = StoryObj<typeof ExternalLinkAdornment>;

export const Https: Story = {};

export const LongUrl: Story = {
  args: {
    value: "https://docs.saleor.io/developer/attributes/overview#plain-text-attributes",
  },
};

export const NotALink: Story = {
  args: {
    value: "saleor.io",
  },
};

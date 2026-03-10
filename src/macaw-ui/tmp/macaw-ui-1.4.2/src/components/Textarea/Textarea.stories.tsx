import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Textarea } from ".";

const meta: Meta<typeof Textarea> = {
  title: "Components / Textarea",
  tags: ["autodocs"],
  component: Textarea,
  args: {
    label: "Label",
    size: "large",
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

const TextareaTemplate: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState("Textarea content");

    return (
      <Textarea
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Default: Story = {
  ...TextareaTemplate,
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Textarea content");

  <Textarea
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />`,
      },
    },
  },
};

export const Errored: Story = {
  ...TextareaTemplate,
  args: {
    error: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Textarea content");
  
  <Textarea
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    error
  />`,
      },
    },
  },
};

export const Disabled: Story = {
  ...TextareaTemplate,
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Textarea content");
  
  <Textarea
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    disabled
  />`,
      },
    },
  },
};

export const WithHelpText: Story = {
  ...TextareaTemplate,
  args: {
    helperText: "Helper text",
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Textarea content");
  
  <Textarea
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    helperText="Helper text"
  />`,
      },
    },
  },
};

export const WithSingleRow: Story = {
  ...TextareaTemplate,
  args: {
    rows: 1,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Textarea content");
  
  <Textarea
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    rows={1}
  />`,
      },
    },
  },
};

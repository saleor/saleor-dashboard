import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Box, Text } from "..";

import { Input } from ".";

const meta: Meta<typeof Input> = {
  title: "Components / Input",
  tags: ["autodocs"],
  component: Input,
  args: {
    label: "Label",
    size: "large",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

const InputTemplate: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState("Input content");

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Default: Story = {
  ...InputTemplate,
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Input content");

  <Input
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
  ...InputTemplate,
  args: {
    error: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Input content");
  
  <Input
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
  ...InputTemplate,
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Input content");
  
  <Input
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
  ...InputTemplate,
  args: {
    helperText: "Helper text",
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("Input content");
  
  <Input
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

const InputNumberTemplate: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(args.value);

    return (
      <Box __width="200px">
        <Input
          {...args}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          endAdornment={<Text size={1}>USD</Text>}
        />
      </Box>
    );
  },
};

export const Number: Story = {
  ...InputNumberTemplate,
  args: {
    value: "0",
    label: null,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("0");
  
  <Input
    type="number"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    endAdornment={<Text size={1}>USD</Text>}
  />`,
      },
    },
  },
};

export const NumberWithLabel: Story = {
  ...InputNumberTemplate,
  args: {
    label: "Price",
    value: 0.9,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("0.9");
  
  <Input
    label="Price"
    type="number"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    endAdornment={<Text size={1}>USD</Text>}
  />`,
      },
    },
  },
};

export const Date: Story = {
  ...InputTemplate,
  args: {
    type: "date",
    value: "",
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("");
  
  <Input
    type="date"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />`,
      },
    },
  },
};

export const Time: Story = {
  ...InputTemplate,
  args: {
    type: "time",
    value: "",
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("");
  
  <Input
    type="time"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />`,
      },
    },
  },
};

export const DateTime: Story = {
  ...InputTemplate,
  args: {
    type: "datetime-local",
    value: "",
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState("");
  
  <Input
    type="datetime-local"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />`,
      },
    },
  },
};

import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Option } from "~/components/BaseSelect";

import { Box } from "../Box";
import { Select } from ".";

const options = [
  { value: "color-black", label: "Black" },
  { value: "color-red", label: "Red" },
  { value: "color-green", label: "Green" },
  { value: "color-blue", label: "Blue" },
  { value: "color-orange", label: "Orange" },
  { value: "color-purple", label: "Purple" },
];

const meta: Meta<typeof Select> = {
  title: "Components / Select",
  tags: ["autodocs"],
  component: Select,
  args: {
    options,
    label: "Pick a color",
    size: "large",
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 300,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const SelectTemplate: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(options[0]);

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => setValue(value as Option)}
      />
    );
  },
};

export const Default: Story = {
  ...SelectTemplate,
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = useState({ value: "color-black", label: "Black" });

<Select
  label="Label"
  size="large"
  value={value}
  onChange={(e) => setValue(value)}
  options={[{ value: "color-black", label: "Black" }]}
/>;
        `,
      },
    },
  },
};

export const Error: Story = {
  ...SelectTemplate,
  args: {
    error: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = useState({ value: "color-black", label: "Black" });

<Select
  label="Label"
  size="large"
  value={value}
  onChange={(e) => setValue(value)}
  options={[{ value: "color-black", label: "Black" }]}
  error
/>;
        `,
      },
    },
  },
};

export const Disabled: Story = {
  ...SelectTemplate,
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = useState({ value: "color-black", label: "Black" });

<Select
  label="Label"
  size="large"
  value={value}
  onChange={(e) => setValue(value)}
  options={[{ value: "color-black", label: "Black" }]}
  disabled
/>;
        `,
      },
    },
  },
};

export const WithHelperText: Story = {
  ...SelectTemplate,
  args: {
    helperText: "Helper text",
  },
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = useState({ value: "color-black", label: "Black" });

<Select
  label="Label"
  size="large"
  value={value}
  onChange={(e) => setValue(value)}
  options={[{ value: "color-black", label: "Black" }]}
  helperText="Helper text"
/>;
        `,
      },
    },
  },
};

export const WithStringValue = () => {
  const [value, setValue] = useState("color-black");

  return (
    <Select
      options={options}
      value={value}
      size="large"
      onChange={(value) => setValue(value)}
    />
  );
};

export const WithStartAdornment = () => {
  const [value, setValue] = useState("color-black");

  return (
    <Select
      label="Pick a color"
      size="large"
      value={value}
      onChange={(value) => setValue(value)}
      startAdornment={(value) => {
        if (!value) {
          return null;
        }

        return (
          <Box
            width={4}
            height={4}
            marginRight={2}
            __flexShrink={0}
            __backgroundColor={value}
          ></Box>
        );
      }}
      options={options.map((option) => {
        const value = option.value.split("color-")[1];
        return {
          ...option,
          value,
          startAdornment: (
            <Box
              __backgroundColor={value}
              marginRight={2}
              width={4}
              height={4}
              __flexShrink={0}
            ></Box>
          ),
        };
      })}
    />
  );
};

export const WithEllipsis = () => {
  const values = [
    { value: "color-black", label: "Very very long black label here" },
    {
      value: "color-red",
      label: "Long red label here",
    },
  ];
  const [value, setValue] = useState("color-black");

  return (
    <Box __width="200px">
      <Select
        options={values}
        value={value}
        size="large"
        label="Label"
        onChange={(value) => setValue(value)}
      />
    </Box>
  );
};

export const WithDisabledOption = () => {
  const values: Option[] = options.map((option) => ({
    ...option,
    disabled: option.value === "color-green",
  }));

  const [value, setValue] = useState("color-black");

  return (
    <Box __width="200px">
      <Select
        options={values}
        value={value}
        size="large"
        label="Label"
        onChange={(value) => setValue(value)}
      />
    </Box>
  );
};

export const Empty = () => {
  return <Select options={options} value="" />;
};

export const NoOptions = () => {
  return (
    <Box __width="200px">
      <Select
        options={[]}
        value={null}
        size="large"
        label="Label"
        onChange={() => undefined}
      >
        <Select.NoOptions>No items to select</Select.NoOptions>
      </Select>
    </Box>
  );
};

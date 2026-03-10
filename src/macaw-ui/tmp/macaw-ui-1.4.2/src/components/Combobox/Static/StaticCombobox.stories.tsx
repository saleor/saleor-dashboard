import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Option } from "~/components/BaseSelect";
import { Box } from "~/components/Box";
import { Combobox } from "..";

const options = [
  { value: "color-black", label: "Black" },
  { value: "color-red", label: "Red" },
  { value: "color-green", label: "Green" },
  { value: "color-blue", label: "Blue" },
  { value: "color-orange", label: "Orange" },
  { value: "color-purple", label: "Purple" },
];

const meta: Meta<typeof Combobox> = {
  title: "Components / Combobox",
  tags: ["autodocs"],
  component: Combobox,
  args: {
    options,
    label: "Pick a color",
    id: "combobox",
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
type Story = StoryObj<typeof Combobox>;

const ComboboxTemplate: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<Option | null>(options[0]);

    return (
      <Combobox {...args} value={value} onChange={(value) => setValue(value)} />
    );
  },
};

export const Default: Story = {
  ...ComboboxTemplate,
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState({ value: "color-black", label: "Black" });
  
  <Combobox
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(value)}
    options={[{ value: "color-black", label: "Black" }]}
  />`,
      },
    },
  },
};

export const Error: Story = {
  ...ComboboxTemplate,
  args: {
    error: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState({ value: "color-black", label: "Black" });
  
  <Combobox
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(value)}
    options={[{ value: "color-black", label: "Black" }]}
    error
  />`,
      },
    },
  },
};

export const Disabled: Story = {
  ...ComboboxTemplate,
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState({ value: "color-black", label: "Black" });
  
  <Combobox
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(value)}
    options={[{ value: "color-black", label: "Black" }]}
    disabled
  />`,
      },
    },
  },
};

export const WithHelperText: Story = {
  ...ComboboxTemplate,
  args: {
    helperText: "Helper text",
  },
  parameters: {
    docs: {
      source: {
        code: `
  const [value, setValue] = useState({ value: "color-black", label: "Black" });
  
  <Combobox
    label="Label"
    size="large"
    value={value}
    onChange={(e) => setValue(value)}
    options={[{ value: "color-black", label: "Black" }]}
    helperText="Helper text"
  />`,
      },
    },
  },
};

export const Example = () => {
  const [value, setValue] = useState<string | null>("color-black");

  return (
    <Combobox
      label="Pick a color"
      size="large"
      value={value}
      onChange={(value) => setValue(value)}
      options={options}
    />
  );
};

export const WithStringValue = () => {
  const [value, setValue] = useState<string | null>("color-black");

  return (
    <Combobox
      label="Pick a color"
      size="large"
      value={value}
      onChange={(value) => setValue(value)}
      options={options}
    />
  );
};

export const WithAdornment = () => {
  const [value, setValue] = useState<Option | null>(null);

  return (
    <Combobox
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
            __backgroundColor={value.value}
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
  const [value, setValue] = useState<Option | null>(values[0]);

  return (
    <Box __width="200px">
      <Combobox
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
  const values = options.map((option) => ({
    ...option,
    disabled: option.value === "color-green",
  }));
  const [value, setValue] = useState<Option | null>(values[0]);

  return (
    <Box __width="200px">
      <Combobox
        options={values}
        value={value}
        size="large"
        label="Label"
        onChange={(value) => setValue(value)}
      />
    </Box>
  );
};

export const NoOptions = () => {
  return (
    <Box __width="200px">
      <Combobox
        options={[]}
        value={null}
        size="large"
        label="Label"
        onChange={() => undefined}
      >
        <Combobox.NoOptions>No items to select</Combobox.NoOptions>
      </Combobox>
    </Box>
  );
};

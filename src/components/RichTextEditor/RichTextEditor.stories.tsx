import { type OutputData } from "@editorjs/editorjs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ComponentType, useRef } from "react";

import fixtures from "./fixtures.json";
import RichTextEditor from "./RichTextEditor";

const defaultValue = fixtures.richTextEditor as unknown as OutputData;

type Props = ComponentProps<typeof RichTextEditor>;

const meta: Meta<typeof RichTextEditor> = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
  decorators: [
    (Story: ComponentType) => (
      <div style={{ maxWidth: 720, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    name: "rich-text-editor",
    label: "Description",
    disabled: false,
    error: false,
  },
  argTypes: {
    editorRef: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onInitialize: { table: { disable: true } },
  },
  render: (args: Props) => {
    const Wrapper = () => {
      const ref = useRef(null);

      return <RichTextEditor {...args} editorRef={ref} />;
    };

    return <Wrapper />;
  },
};

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

export const Empty: Story = {};

export const WithContent: Story = {
  args: {
    defaultValue,
  },
};

export const WithHelperText: Story = {
  args: {
    defaultValue,
    helperText: "Markdown is not supported. Use the toolbar instead.",
  },
};

export const Error: Story = {
  args: {
    defaultValue,
    error: true,
    helperText: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue,
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: {
    defaultValue,
    label: "",
  },
};

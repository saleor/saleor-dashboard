import { type OutputData } from "@editorjs/editorjs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ComponentType, useRef, useState } from "react";

import fixtures from "./fixtures.json";
import RichTextEditor from "./RichTextEditor";

const defaultValue = fixtures.richTextEditor as unknown as OutputData;

type Props = ComponentProps<typeof RichTextEditor>;

const layout: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "flex-start",
    gap: 24,
  },
  editor: {
    flex: 1,
    minWidth: 0,
  },
  preview: {
    flex: "0 0 320px",
    position: "sticky",
    top: 24,
    border: "1px solid rgba(128, 128, 128, 0.3)",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewTitle: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: 600,
    padding: "8px 12px",
    borderBottom: "1px solid rgba(128, 128, 128, 0.3)",
    opacity: 0.7,
  },
  pre: {
    margin: 0,
    padding: 12,
    fontSize: 11,
    lineHeight: 1.5,
    maxHeight: 480,
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};

// Wraps the editor with a live preview of the saved EditorJS blocks. The editor's
// onChange fires on every edit, so the panel mirrors exactly what gets persisted —
// handy for inspecting block shapes (e.g. the table block) while editing.
const EditorWithLivePreview = (args: Props): React.ReactElement => {
  const ref = useRef(null);
  const [data, setData] = useState<OutputData | undefined>(args.defaultValue);

  return (
    <div style={layout.container}>
      <div style={layout.editor}>
        <RichTextEditor {...args} editorRef={ref} onChange={setData} />
      </div>
      <aside style={layout.preview}>
        <div style={layout.previewTitle}>Live blocks</div>
        <pre style={layout.pre}>
          {data?.blocks?.length
            ? JSON.stringify(data.blocks, null, 2)
            : "// Start typing to see blocks"}
        </pre>
      </aside>
    </div>
  );
};

const meta: Meta<typeof RichTextEditor> = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
  decorators: [
    (Story: ComponentType) => (
      <div style={{ maxWidth: 1100, padding: 24 }}>
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
  render: (args: Props): React.ReactElement => <EditorWithLivePreview {...args} />,
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

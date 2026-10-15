import useRichText from "@dashboard/utils/richText/useRichText";
import { type OutputData } from "@editorjs/editorjs";
import { Box } from "@saleor/macaw-ui-next";
import { type Meta, type StoryObj } from "@storybook/react-vite";

import { FullDescriptionEditor } from "./FullDescriptionEditor";

interface EditorStoryProps {
  disabled: boolean;
  error: boolean;
  helperText?: string;
  initial: string | null;
  loading: boolean;
}

const EditorStory = ({ initial, loading, ...props }: EditorStoryProps): JSX.Element => {
  const richText = useRichText({ initial, loading, triggerChange: () => undefined });

  return (
    <Box padding={6} __maxWidth="800px">
      <FullDescriptionEditor {...props} richText={richText} />
    </Box>
  );
};

const content: OutputData = {
  blocks: [
    { type: "header", data: { text: "Summer essentials", level: 2 } },
    { type: "paragraph", data: { text: "Explore lightweight clothing for warm days." } },
  ],
};

const meta: Meta<typeof EditorStory> = {
  title: "Components/FullDescriptionEditor",
  component: EditorStory,
  args: { disabled: false, error: false, initial: null, loading: false },
};

export default meta;

type Story = StoryObj<typeof EditorStory>;

export const Empty: Story = {};
export const WithContent: Story = { args: { initial: JSON.stringify(content) } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true, initial: JSON.stringify(content) } };
export const Error: Story = {
  args: { error: true, helperText: "The full description could not be saved." },
};

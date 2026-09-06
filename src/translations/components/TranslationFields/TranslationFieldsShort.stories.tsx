import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import TranslationFieldsShort from "./TranslationFieldsShort";

const meta: Meta<typeof TranslationFieldsShort> = {
  title: "Translations/TranslationFieldsShort",
  component: TranslationFieldsShort,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    saveButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
  },
  args: {
    disabled: false,
    edit: true,
    initial: "Chaise longue",
    saveButtonState: "default",
    onDiscard: fn(),
    onSubmit: fn(async () => []),
  },
};

export default meta;

type Story = StoryObj<typeof TranslationFieldsShort>;

export const Editing: Story = {};

export const ReadOnly: Story = { args: { edit: false } };

export const EmptyReadOnly: Story = { args: { edit: false, initial: null } };

export const Saving: Story = { args: { saveButtonState: "loading" } };

export const WithoutActions: Story = { args: { hideActions: true } };

export const Disabled: Story = { args: { disabled: true, saveDisabled: true } };

import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import TranslationFieldsLong from "./TranslationFieldsLong";

const meta: Meta<typeof TranslationFieldsLong> = {
  title: "Translations/TranslationFieldsLong",
  component: TranslationFieldsLong,
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
    initial:
      "Une chaise longue confortable, fabriquée à la main à partir de chêne massif issu de forêts gérées durablement.",
    saveButtonState: "default",
    onDiscard: fn(),
    onSubmit: fn(async () => []),
  },
};

export default meta;

type Story = StoryObj<typeof TranslationFieldsLong>;

export const Editing: Story = {};

export const ReadOnly: Story = { args: { edit: false } };

export const EmptyReadOnly: Story = { args: { edit: false, initial: null } };

export const Saving: Story = { args: { saveButtonState: "loading" } };

export const WithoutActions: Story = { args: { hideActions: true } };

export const Disabled: Story = { args: { disabled: true, saveDisabled: true } };

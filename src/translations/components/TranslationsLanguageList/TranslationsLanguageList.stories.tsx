import { languages } from "@dashboard/translations/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";

import TranslationsLanguageList from "./TranslationsLanguageList";

const meta: Meta<typeof TranslationsLanguageList> = {
  title: "Translations/TranslationsLanguageList",
  component: TranslationsLanguageList,
  args: { languages },
};

export default meta;
type Story = StoryObj<typeof TranslationsLanguageList>;

export const Default: Story = {};

/** No languages fetched yet — skeleton rows hold the layout. */
export const Loading: Story = {
  args: { languages: undefined },
};

export const Empty: Story = {
  args: { languages: [] },
};

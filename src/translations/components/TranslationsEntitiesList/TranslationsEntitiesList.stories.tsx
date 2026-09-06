import { pageListProps } from "@dashboard/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";

import TranslationsEntitiesList, { type TranslatableEntity } from "./TranslationsEntitiesList";

const entities: TranslatableEntity[] = [
  { id: "1", name: "Apple Juice", completion: { current: 3, max: 3 } },
  { id: "2", name: "Banana Juice", completion: { current: 1, max: 3 } },
  { id: "3", name: "Carrot Juice", completion: { current: 0, max: 3 } },
];

const meta: Meta<typeof TranslationsEntitiesList> = {
  title: "Translations/TranslationsEntitiesList",
  component: TranslationsEntitiesList,
  args: {
    ...pageListProps.default,
    entities,
    getRowHref: (id: string) => `/translations/en/products/${id}`,
  },
};

export default meta;
type Story = StoryObj<typeof TranslationsEntitiesList>;

export const Default: Story = {};

export const Loading: Story = {
  args: { ...pageListProps.loading, entities: undefined },
};

export const Empty: Story = {
  args: { entities: [] },
};

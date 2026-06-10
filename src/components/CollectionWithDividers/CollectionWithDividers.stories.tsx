import { Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import CollectionWithDividers from "./CollectionWithDividers";

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: "1", name: "First item" },
  { id: "2", name: "Second item" },
  { id: "3", name: "Third item" },
];

const meta: Meta<typeof CollectionWithDividers<Item>> = {
  title: "Components/CollectionWithDividers",
  component: CollectionWithDividers,
  args: {
    collection: items,
    renderItem: (item: Item | undefined) => (
      <div style={{ padding: "12px 16px" }}>
        <Text>{item?.name}</Text>
      </div>
    ),
  },
  argTypes: {
    renderItem: { table: { disable: true } },
    renderEmpty: { table: { disable: true } },
    DividerComponent: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof CollectionWithDividers<Item>>;

export const Default: Story = {};

export const WithOuterDividers: Story = {
  args: {
    withOuterDividers: true,
  },
};

export const Empty: Story = {
  args: {
    collection: [],
    renderEmpty: () => (
      <div style={{ padding: "12px 16px" }}>
        <Text color="default2">No items to display</Text>
      </div>
    ),
  },
};

export const EmptyWithoutPlaceholder: Story = {
  args: {
    collection: [],
  },
};

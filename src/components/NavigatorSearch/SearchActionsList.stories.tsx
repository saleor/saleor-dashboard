import { type SearchActionContext } from "@dashboard/extensions/search-actions/resolveSearchActionContext";
import { type ContextualSearchAction } from "@dashboard/extensions/search-actions/types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchActionsList } from "./SearchActionsList";

const context: SearchActionContext = {
  view: "PRODUCT_DETAILS",
  params: { productId: "UHJvZHVjdDox" },
};

const actions: ContextualSearchAction[] = [
  {
    id: "extension-1",
    label: "Generate product description",
    section: "App actions",
    onSelect: () => undefined,
  },
  {
    id: "extension-2",
    label: "Sync to external catalog",
    section: "App actions",
    onSelect: () => undefined,
  },
  {
    id: "native-1",
    label: "Duplicate product",
    section: "Dashboard actions",
    onSelect: () => undefined,
  },
];

const meta: Meta<typeof SearchActionsList> = {
  title: "NavigatorSearch/SearchActionsList",
  component: SearchActionsList,
  args: {
    context,
    query: "",
    onActionSelected: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof SearchActionsList>;

export const Default: Story = {
  args: {
    actions,
  },
};

export const Filtered: Story = {
  args: {
    actions,
    query: "sync",
  },
};

export const Empty: Story = {
  args: {
    actions: [],
  },
};

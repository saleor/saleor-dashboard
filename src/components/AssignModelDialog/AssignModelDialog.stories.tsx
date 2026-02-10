import { SearchPagesQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import AssignModelDialog from "./AssignModelDialog";

type Pages = RelayToFlat<SearchPagesQuery["search"]>;

const mockPages: Pages = Array.from({ length: 8 }, (_, i) => ({
  __typename: "Page" as const,
  id: `page-${i + 1}`,
  title: `Page ${i + 1}`,
}));

const noop = () => {};

const meta: Meta<typeof AssignModelDialog> = {
  title: "Components/AssignModelDialog",
  component: AssignModelDialog,
  args: {
    open: true,
    pages: mockPages,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: noop,
    onFetchMore: noop,
    onSubmit: noop,
    onFilterChange: noop,
  },
};

export default meta;
type Story = StoryObj<typeof AssignModelDialog>;

export const Default: Story = {};

export const SingleSelection: Story = {
  args: {
    selectionMode: "single",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    pages: [],
  },
};

export const Empty: Story = {
  args: {
    pages: [],
  },
};

export const WithLockedPageType: Story = {
  args: {
    initialConstraints: {
      pageType: "page-type-1",
    },
  },
};

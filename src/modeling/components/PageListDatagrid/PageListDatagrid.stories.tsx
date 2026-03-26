import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PageListDatagrid } from "./PageListDatagrid";

const mockPages = [
  {
    id: "page-1",
    title: "About Us",
    slug: "about-us",
    isPublished: true,
    pageType: { id: "pt-1", name: "Static Page", __typename: "PageType" as const },
    __typename: "Page" as const,
  },
  {
    id: "page-2",
    title: "Privacy Policy",
    slug: "privacy-policy",
    isPublished: true,
    pageType: { id: "pt-1", name: "Static Page", __typename: "PageType" as const },
    __typename: "Page" as const,
  },
  {
    id: "page-3",
    title: "Terms of Service",
    slug: "terms",
    isPublished: false,
    pageType: { id: "pt-2", name: "Legal", __typename: "PageType" as const },
    __typename: "Page" as const,
  },
] as any;

const meta: Meta<typeof PageListDatagrid> = {
  title: "Modeling/PageListDatagrid",
  component: PageListDatagrid,

  args: {
    pages: mockPages,
    loading: false,
    disabled: false,
    hasRowHover: true,
    sort: { sort: "title" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["title", "slug", "visible", "contentType"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectPageIds: fn(),
    onRowClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PageListDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Empty: Story = {
  args: { pages: [] },
};

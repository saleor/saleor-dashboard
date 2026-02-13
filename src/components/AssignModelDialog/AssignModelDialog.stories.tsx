import type { Meta, StoryObj } from "@storybook/react-vite";
import { withFilterApolloMocks } from "@storybookUtils/AssignDialogShared/decorators";
import { PageFactory } from "@storybookUtils/AssignDialogShared/factories";
import { ComponentProps } from "react";
import { fn } from "storybook/test";

import AssignModelDialog from "./AssignModelDialog";

type Props = ComponentProps<typeof AssignModelDialog>;

const meta: Meta<typeof AssignModelDialog> = {
  title: "Components/Dialogs/AssignModelDialog",
  component: AssignModelDialog,
  decorators: [withFilterApolloMocks],
  loaders: [async () => ({ pages: await PageFactory.buildList(8) })],
  render: (args: Props, { loaded }: { loaded: { pages: Props["pages"] } }) => (
    <AssignModelDialog {...args} pages={args.pages ?? loaded.pages} />
  ),
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onFetchMore: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    onFilterChange: { table: { disable: true } },
    pages: { table: { disable: true } },
    excludedFilters: { table: { disable: true } },
    initialConstraints: { table: { disable: true } },
    labels: { table: { disable: true } },
  },
  args: {
    open: true,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
    onFilterChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignModelDialog>;

export const Default: Story = {};

export const SingleSelection: Story = {
  args: { selectionMode: "single" },
};

export const Loading: Story = {
  args: { loading: true, pages: [] },
};

export const Empty: Story = {
  args: { pages: [] },
};

export const WithLockedPageType: Story = {
  args: {
    initialConstraints: {
      pageTypes: [{ id: "page-type-1", name: "Blog Post" }],
    },
  },
};

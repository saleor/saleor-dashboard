import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageFactory } from "../AssignDialogShared/factories";
import AssignModelDialog from "./AssignModelDialog";

const noop = () => {};

const meta: Meta<typeof AssignModelDialog> = {
  title: "Components/Dialogs/AssignModelDialog",
  component: AssignModelDialog,
  loaders: [async () => ({ pages: await PageFactory.buildList(8) })],
  render: (args, { loaded: { pages } }) => (
    <AssignModelDialog {...args} pages={args.pages ?? pages} />
  ),
  args: {
    open: true,
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

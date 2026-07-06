import type { Meta, StoryObj } from "@storybook/react-vite";
import { WarehouseFactory } from "@storybookUtils/AssignDialogShared/factories";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { AssignWarehouseDialog } from "./AssignWarehouseDialog";

type Props = ComponentProps<typeof AssignWarehouseDialog>;

const meta: Meta<typeof AssignWarehouseDialog> = {
  title: "Components/Dialogs/AssignWarehouseDialog",
  component: AssignWarehouseDialog,
  loaders: [async () => ({ warehouses: await WarehouseFactory.buildList(8) })],
  render: (args: Props, { loaded }: { loaded: { warehouses: Props["warehouses"] } }) => (
    <AssignWarehouseDialog {...args} warehouses={args.warehouses ?? loaded.warehouses} />
  ),
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onFetch: { table: { disable: true } },
    onFetchMore: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    warehouses: { table: { disable: true } },
  },
  args: {
    open: true,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignWarehouseDialog>;

const findDialog = async () => {
  const body = within(document.body);
  const dialog = await body.findByRole("dialog");

  return within(dialog);
};

export const Default: Story = {
  play: async ({ args, loaded }: { args: Props; loaded: { warehouses: Props["warehouses"] } }) => {
    // Arrange
    const dialog = await findDialog();
    const rows = await dialog.findAllByTestId("dialog-row");
    const checkboxes = rows.map(row => within(row).getByRole("checkbox"));

    // Act
    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[1]);
    await userEvent.click(dialog.getByTestId("assign-and-save-button"));

    // Assert
    await expect(args.onSubmit).toHaveBeenCalledOnce();

    const submittedItems = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0];

    await expect(submittedItems).toHaveLength(2);
    await expect(submittedItems[0]).toMatchObject({
      id: loaded.warehouses[0].id,
      name: "US East Warehouse",
    });
    await expect(submittedItems[1]).toMatchObject({
      id: loaded.warehouses[1].id,
      name: "US West Warehouse",
    });
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

export const SearchTriggersOnFetch: Story = {
  play: async ({ args }: { args: Props }) => {
    // Arrange
    const dialog = await findDialog();
    const searchInput = await dialog.findByPlaceholderText("Search by warehouse name");

    // Act
    await userEvent.type(searchInput, "east");

    // Assert
    await expect(args.onFetch).toHaveBeenCalled();
  },
};

export const CloseDialog: Story = {
  play: async ({ args }: { args: Props }) => {
    // Arrange
    const dialog = await findDialog();
    const backButton = await dialog.findByTestId("back");

    // Act
    await userEvent.click(backButton);

    // Assert
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

export const Empty: Story = {
  args: { warehouses: [] },
  play: async () => {
    // Arrange
    const dialog = await findDialog();

    // Assert
    await expect(await dialog.findByText("No warehouses available to add")).toBeInTheDocument();

    const rows = dialog.queryAllByTestId("dialog-row");

    await expect(rows).toHaveLength(0);
  },
};

export const HasMore: Story = {
  args: { hasMore: true },
};

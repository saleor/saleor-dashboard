import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  AssignShippingZoneDialog,
  type AssignShippingZoneDialogProps,
} from "./AssignShippingZoneDialog";

const shippingZones = [
  { id: "U2hpcHBpbmdab25lOjE=", name: "Europe" },
  { id: "U2hpcHBpbmdab25lOjI=", name: "North America" },
  { id: "U2hpcHBpbmdab25lOjM=", name: "Asia Pacific" },
];

type Props = AssignShippingZoneDialogProps;

const meta: Meta<typeof AssignShippingZoneDialog> = {
  title: "Components/Dialogs/AssignShippingZoneDialog",
  component: AssignShippingZoneDialog,
  args: {
    open: true,
    loading: false,
    hasMore: false,
    shippingZones,
    confirmButtonState: "default",
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignShippingZoneDialog>;

const findDialog = async () => {
  const body = within(document.body);
  const dialog = await body.findByRole("dialog");

  return within(dialog);
};

export const Default: Story = {
  play: async ({ args }: { args: Props }) => {
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
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

export const Empty: Story = {
  args: { shippingZones: [] },
  play: async () => {
    // Arrange
    const dialog = await findDialog();

    // Assert
    await expect(await dialog.findByText("No shipping zones available to add")).toBeInTheDocument();
  },
};

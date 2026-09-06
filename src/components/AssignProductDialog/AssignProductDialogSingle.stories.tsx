import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ComponentType } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { ModalProductFilterProvider } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignProductDialogSingle } from "./AssignProductDialogSingle";
import { searchProducts } from "./fixtures";

const meta: Meta<typeof AssignProductDialogSingle> = {
  title: "Components/AssignProductDialogSingle",
  component: AssignProductDialogSingle,
  decorators: [
    (Story: ComponentType): JSX.Element => (
      <ModalProductFilterProvider>
        <Story />
      </ModalProductFilterProvider>
    ),
  ],
  args: {
    open: true,
    confirmButtonState: "default",
    products: searchProducts,
    loading: false,
    hasMore: false,
    onClose: fn(),
    onFetchMore: fn(),
    onFilterChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignProductDialogSingle>;
type Props = ComponentProps<typeof AssignProductDialogSingle>;

export const Default: Story = {};

/** Opened on an existing assignment — that row starts selected. */
export const WithSelection: Story = {
  args: { selectedId: "product-2" },
};

export const Loading: Story = {
  args: { products: [], loading: true },
};

export const Empty: Story = {
  args: { products: [] },
};

/** Rows outside the voucher's channels render dimmed with an explanation. */
export const WithUnavailableProducts: Story = {
  args: {
    selectedChannels: [{ id: "channel-missing" }],
    productUnavailableText: "Not available in the selected channels",
  },
};

// The dialog renders in a Radix portal, so the story queries the document body for it.
const findDialog = async () => within(await within(document.body).findByRole("dialog"));

/** Picking a row radio arms the confirm button and submits that one product. */
export const PickingProductRadioSubmitsIt: Story = {
  play: async ({ args }: { args: Props }) => {
    // Arrange
    const dialog = await findDialog();
    const rows = await dialog.findAllByTestId("assign-product-table-row");

    // Act
    await userEvent.click(within(rows[1]).getByRole("radio"));
    await userEvent.click(dialog.getByTestId("submit"));

    // Assert
    await expect(args.onSubmit).toHaveBeenCalledOnce();

    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0];

    await expect(submitted).toHaveLength(1);
    await expect(submitted[0]).toMatchObject({ id: "product-2", name: "T-Shirt" });
  },
};

/** Clicking the assigned row again clears the pick, which submits as "unassign". */
export const ClickingSelectedProductClearsIt: Story = {
  args: { selectedId: "product-2" },
  play: async ({ args }: { args: Props }) => {
    // Arrange
    const dialog = await findDialog();
    const rows = await dialog.findAllByTestId("assign-product-table-row");
    const radio = within(rows[1]).getByRole("radio");

    await expect(radio).toHaveAttribute("aria-checked", "true");

    // Act
    await userEvent.click(radio);

    // Assert
    await expect(radio).toHaveAttribute("aria-checked", "false");

    await userEvent.click(dialog.getByTestId("submit"));

    await expect(args.onSubmit).toHaveBeenCalledExactlyOnceWith([]);
  },
};

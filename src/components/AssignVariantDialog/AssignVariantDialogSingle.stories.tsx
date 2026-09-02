import { searchProducts } from "@dashboard/components/AssignProductDialog/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ComponentType } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { ModalProductFilterProvider } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignVariantDialogSingle } from "./AssignVariantDialogSingle";

const meta: Meta<typeof AssignVariantDialogSingle> = {
  title: "Components/AssignVariantDialogSingle",
  component: AssignVariantDialogSingle,
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
type Story = StoryObj<typeof AssignVariantDialogSingle>;
type Props = ComponentProps<typeof AssignVariantDialogSingle>;

/** Product 3 has more variants than one page holds, so it grows a "Load more" row. */
export const Default: Story = {};

export const WithSelection: Story = {
  args: { selectedId: "product-1-M" },
};

export const Loading: Story = {
  args: { products: [], loading: true },
};

export const Empty: Story = {
  args: { products: [] },
};

// The dialog renders in a Radix portal, so the story queries the document body for it.
const findDialog = async () => within(await within(document.body).findByRole("dialog"));

/** Only variants are selectable; the product rows above them carry no radio. */
export const PickingVariantRadioSubmitsIt: Story = {
  play: async ({ args }: { args: Props }) => {
    // Arrange
    const dialog = await findDialog();
    const rows = await dialog.findAllByTestId("assign-variant-table-row");

    // Act
    await userEvent.click(within(rows[1]).getByRole("radio"));
    await userEvent.click(dialog.getByTestId("submit"));

    // Assert
    await expect(args.onSubmit).toHaveBeenCalledOnce();

    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0];

    await expect(submitted).toHaveLength(1);
    await expect(submitted[0]).toMatchObject({ id: "product-1-M" });
  },
};

/** The pick moves with the last clicked radio, so only that variant is submitted. */
export const PickingAnotherVariantReplacesSelection: Story = {
  args: { selectedId: "product-1-M" },
  play: async ({ args }: { args: Props }) => {
    // Arrange
    const dialog = await findDialog();
    const rows = await dialog.findAllByTestId("assign-variant-table-row");

    await expect(within(rows[1]).getByRole("radio")).toHaveAttribute("aria-checked", "true");

    // Act
    await userEvent.click(within(rows[2]).getByRole("radio"));
    await userEvent.click(dialog.getByTestId("submit"));

    // Assert
    const submitted = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0];

    await expect(submitted).toHaveLength(1);
    await expect(submitted[0]).toMatchObject({ id: "product-1-L" });
  },
};

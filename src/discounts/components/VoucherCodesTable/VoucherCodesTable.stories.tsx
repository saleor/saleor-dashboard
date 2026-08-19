import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { VoucherCodesTable } from "./VoucherCodesTable";

const mockCodes: VoucherCode[] = [
  { code: "SUMMER2024", used: 15, isActive: true },
  { code: "WINTER2024", used: 3, isActive: true },
  { code: "EXPIRED01", used: 100, isActive: false },
  { code: "DRAFTCODE", used: undefined, isActive: undefined },
];

const meta: Meta<typeof VoucherCodesTable> = {
  title: "Discounts/VoucherCodesTable",
  component: VoucherCodesTable,
  decorators: [
    (Story: StoryFn) => (
      <PaginatorContext.Provider
        value={{
          loadNextPage: fn(),
          loadPreviousPage: fn(),
          paginatorType: "click",
          endCursor: "",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
        }}
      >
        <Story />
      </PaginatorContext.Provider>
    ),
  ],
  args: {
    codes: mockCodes,
    loading: false,
    disabled: false,
    selectedCodesIds: [],
    settings: { rowNumber: 10 },
    onSettingsChange: fn(),
    onSelectedCodesChange: fn(),
    onDeleteCode: fn(),
    onBulkDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VoucherCodesTable>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true, codes: [] },
};

export const Empty: Story = {
  args: { codes: [] },
};

export const WithSelection: Story = {
  args: { selectedCodesIds: ["SUMMER2024", "WINTER2024"] },
};

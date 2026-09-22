import {
  type ChannelFragment,
  type ExportProductsInput,
  ExportScope,
  FileTypesEnum,
  ProductFieldEnum,
} from "@dashboard/graphql";
import { Box, type Option } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ProductExportDialogInfo from "./ProductExportDialogInfo";

const channel = (id: string, name: string, slug: string): ChannelFragment => ({
  __typename: "Channel",
  id,
  name,
  slug,
  isActive: true,
  currencyCode: "USD",
  defaultCountry: { __typename: "CountryDisplay", code: "US", country: "United States" },
  stockSettings: {
    __typename: "StockSettings",
    allocationStrategy:
      "PRIORITIZE_SORTING_ORDER" as ChannelFragment["stockSettings"]["allocationStrategy"],
  },
});

const channels = [
  channel("channel-1", "Default channel", "default-channel"),
  channel("channel-2", "Europe", "europe"),
];

const attributes: Option[] = [
  { label: "Colour", value: "attr-colour" },
  { label: "Size", value: "attr-size" },
  { label: "Material", value: "attr-material" },
];

const warehouses: Option[] = [
  { label: "Europe warehouse", value: "warehouse-1" },
  { label: "US warehouse", value: "warehouse-2" },
];

const data: ExportProductsInput = {
  exportInfo: {
    attributes: ["attr-colour"],
    channels: ["channel-1"],
    fields: [ProductFieldEnum.NAME, ProductFieldEnum.DESCRIPTION],
    warehouses: ["warehouse-1"],
  },
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.ALL,
};

const meta: Meta<typeof ProductExportDialogInfo> = {
  title: "Products/ProductExportDialogInfo",
  component: ProductExportDialogInfo,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    attributes,
    channels,
    selectedChannels: [channels[0]],
    warehouses,
    data,
    selectedAttributes: [attributes[0]],
    loading: false,
    hasMore: false,
    onAttrtibuteSelect: fn(),
    onWarehouseSelect: fn(),
    onChange: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onSelectAllWarehouses: fn(),
    onSelectAllChannels: fn(),
    onChannelSelect: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ProductExportDialogInfo>;

export const Default: Story = {};

export const NothingSelected: Story = {
  args: {
    selectedAttributes: [],
    selectedChannels: [],
    data: {
      ...data,
      exportInfo: { attributes: [], channels: [], fields: [], warehouses: [] },
    },
  },
};

export const SearchingAttributes: Story = {
  args: { loading: true, attributes: [] },
};

export const ManySelectedAttributes: Story = {
  args: {
    selectedAttributes: [
      ...attributes,
      { label: "Weight", value: "attr-weight" },
      { label: "Origin", value: "attr-origin" },
      { label: "Vintage", value: "attr-vintage" },
    ],
  },
};

import { channelsList } from "@dashboard/channels/fixtures";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { WarehouseListDocument } from "@dashboard/graphql";
import { product as productFixture } from "@dashboard/products/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { withApolloMocks } from "../../../../storybookUtils/apollo";
import { ProductVariants } from "./ProductVariants";

const placeholderImage = "https://via.placeholder.com/64";
const productData = productFixture(placeholderImage);

const channels = channelsList.map(channel => ({
  ...channel,
  variantsIds: productData.variants?.map(v => v.id) ?? [],
  price: "10",
  currency: channel.currencyCode,
  id: channel.id,
  name: channel.name,
}));

const DatagridChangeProvider = ({ children }: { children: ReactElement }) => {
  const state = useDatagridChangeState();

  return (
    <DatagridChangeStateContext.Provider value={state}>
      {children}
    </DatagridChangeStateContext.Provider>
  );
};

const meta: Meta<typeof ProductVariants> = {
  title: "Products/ProductVariants",
  component: ProductVariants,
  decorators: [
    (Story: React.ComponentType) => (
      <DatagridChangeProvider>
        <Story />
      </DatagridChangeProvider>
    ),
    withApolloMocks([
      {
        query: WarehouseListDocument,
        data: {
          warehouses: {
            edges: [
              {
                node: {
                  id: "warehouse-1",
                  name: "US Warehouse",
                },
              },
              {
                node: {
                  id: "warehouse-2",
                  name: "EU Warehouse",
                },
              },
            ],
          },
        },
      },
    ]),
  ],
  argTypes: {
    channels: { table: { disable: true } },
    errors: { table: { disable: true } },
    limits: { table: { disable: true } },
    variantAttributes: { table: { disable: true } },
    selectionVariantAttributes: { table: { disable: true } },
    nonSelectionVariantAttributes: { table: { disable: true } },
    variants: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onRowClick: { table: { disable: true } },
    onAttributeValuesSearch: { table: { disable: true } },
    onBulkCreate: { table: { disable: true } },
  },
  args: {
    variants: productData.variants ?? [],
    channels,
    errors: [],
    limits: {
      currentUsage: { productVariants: 10 },
      allowedUsage: { productVariants: 100 },
    } as any,
    variantAttributes: productData.productType.variantAttributes ?? [],
    selectionVariantAttributes: productData.productType.selectionVariantAttributes ?? [],
    nonSelectionVariantAttributes: productData.productType.nonSelectionVariantAttributes ?? [],
    productName: productData.name,
    productId: productData.id,
    productTypeId: productData.productType.id,
    hasVariants: true,
    onAttributeValuesSearch: fn().mockResolvedValue([]),
    onChange: fn(),
    onRowClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProductVariants>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    variants: [],
  },
};

export const WithoutVariantSupport: Story = {
  args: {
    hasVariants: false,
    variants: [],
  },
};

export const WithErrors: Story = {
  args: {
    errors: [
      {
        field: "price",
        variantIndex: 0,
        type: "channel" as const,
        channelIds: ["channel-1"],
      },
    ],
  },
};

import { GridTable } from "@dashboard/components/GridTable";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ProductTableItem } from "./ProductTableItem";
import { type Product } from "./types";

const sampleProduct: Product = {
  __typename: "Product",
  id: "UHJvZHVjdDox",
  name: "Apple Juice",
  productType: { __typename: "ProductType", id: "pt-1", name: "Beverages" },
  thumbnail: { __typename: "Image", url: "https://placehold.co/64x64/png" },
  channelListings: [
    {
      __typename: "ProductChannelListing",
      id: "pcl-1",
      isPublished: true,
      publishedAt: "2026-01-01T00:00:00Z",
      isAvailableForPurchase: true,
      availableForPurchaseAt: "2026-01-01T00:00:00Z",
      visibleInListings: true,
      channel: {
        __typename: "Channel",
        id: "ch-1",
        name: "Default channel",
        slug: "default",
        currencyCode: "USD",
      },
    },
  ],
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext>
    <SortableContext items={[sampleProduct.id]} strategy={verticalListSortingStrategy}>
      <GridTable borderWidth={0}>
        <GridTable.Colgroup>
          <GridTable.Col __width="40px" />
          <GridTable.Col __width="20px" />
          <GridTable.Col />
          <GridTable.Col />
          <GridTable.Col />
          <GridTable.Col __width="100px" />
        </GridTable.Colgroup>
        <GridTable.Body>{children}</GridTable.Body>
      </GridTable>
    </SortableContext>
  </DndContext>
);

const withWrapper = (Story: ComponentType) => (
  <Wrapper>
    <Story />
  </Wrapper>
);

const meta: Meta<typeof ProductTableItem> = {
  title: "Collections/CollectionProducts/ProductTableItem",
  component: ProductTableItem,
  decorators: [withWrapper],
  args: {
    product: sampleProduct,
    isSelected: false,
    draggable: true,
    toggle: fn(),
    onProductUnassign: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProductTableItem>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const NotDraggable: Story = {
  args: { draggable: false },
};

export const NoThumbnail: Story = {
  args: {
    product: { ...sampleProduct, thumbnail: null },
  },
};

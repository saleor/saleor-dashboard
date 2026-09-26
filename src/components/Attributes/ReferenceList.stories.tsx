import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ReferenceList } from "./ReferenceList";

const meta: Meta<typeof ReferenceList> = {
  title: "Components / ReferenceList",
  component: ReferenceList,
};

export default meta;

type Story = StoryObj<typeof ReferenceList>;

export const Products: Story = {
  args: {
    onRemove: fn(),
    onRemoveAll: fn(),
    onReorder: fn(),
    values: [
      { label: "Alpine Oak Coffee Table", value: "p1", url: "/products/p1" },
      { label: "Andean Wool Throw", value: "p2", url: "/products/p2" },
      { label: "Apple Juice Concentrate 5L", value: "p3", url: "/products/p3" },
      { label: "Asanoha Ceramic Bowl", value: "p4", url: "/products/p4" },
      { label: "Monospace Desk Mat", value: "p5", url: "/products/p5" },
      { label: "Birch Ply Stool", value: "p6", url: "/products/p6" },
    ],
    details: [
      { id: "p1", categoryName: "Furniture" },
      { id: "p2", categoryName: "Textiles" },
      { id: "p3", categoryName: "Pantry" },
      { id: "p4", categoryName: "Tableware" },
      { id: "p5", categoryName: "Desk" },
      { id: "p6", categoryName: "Lighting" },
    ],
  },
};

export const Variants: Story = {
  args: {
    onRemove: fn(),
    onRemoveAll: fn(),
    onReorder: fn(),
    entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
    values: [
      {
        label: "44 / White",
        value: "v1",
        caption: "White Plimsolls",
        url: "/variants/v1",
      },
      {
        label: "700ml",
        value: "v2",
        caption: "Andean Golden Banana",
        url: "/variants/v2",
      },
      {
        label: "S / Oak",
        value: "v3",
        caption: "Alpine Oak Coffee Table",
        url: "/variants/v3",
      },
    ],
    details: [
      { id: "v1", thumbnailUrl: "https://picsum.photos/id/21/56" },
      { id: "v2", thumbnailUrl: "https://picsum.photos/id/1080/56" },
      { id: "v3", thumbnailUrl: "https://picsum.photos/id/1060/56" },
    ],
  },
};

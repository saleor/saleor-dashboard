import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductTypePdpSchematic } from "./ProductTypePdpSchematic";

const meta: Meta<typeof ProductTypePdpSchematic> = {
  title: "Product types / ProductTypePdpSchematic",
  component: ProductTypePdpSchematic,
};

export default meta;

type Story = StoryObj<typeof ProductTypePdpSchematic>;

export const Hoodie: Story = {
  args: {
    hasVariants: true,
    productAttributes: [
      {
        id: "brand",
        name: "Brand",
        choices: { edges: [{ node: { name: "Saleor" } }] },
      },
      { id: "material", name: "Material" },
    ],
    assignedVariantAttributes: [
      { variantSelection: true, attribute: { id: "color", name: "Color" } },
      {
        variantSelection: true,
        attribute: { id: "size", name: "Size", choices: { edges: [{ node: { name: "S" } }] } },
      },
      {
        variantSelection: false,
        attribute: { id: "fit", name: "Fit", choices: { edges: [{ node: { name: "Relaxed" } }] } },
      },
      {
        variantSelection: false,
        attribute: {
          id: "certs",
          name: "Certifications",
          choices: { edges: [{ node: { name: "Fair Trade" } }] },
        },
      },
    ],
    selectedVariantAttributeIds: ["color", "size"],
  },
};

export const Empty: Story = {
  args: {
    hasVariants: true,
    productAttributes: [],
    assignedVariantAttributes: [],
    selectedVariantAttributeIds: [],
  },
};

export const SingleVariant: Story = {
  args: {
    hasVariants: false,
    productAttributes: [{ id: "brand", name: "Brand" }],
    assignedVariantAttributes: [],
    selectedVariantAttributeIds: [],
  },
};

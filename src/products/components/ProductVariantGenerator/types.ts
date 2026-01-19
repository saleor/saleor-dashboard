import { ProductVariantBulkCreateInput, VariantAttributeFragment } from "@dashboard/graphql";

export interface AttributeValueSelection {
  id: string;
  name: string | null;
  slug: string | null;
  selected: boolean;
  // Swatch fields
  file?: { url: string } | null;
  value?: string | null; // hex color for swatches
}

export interface AttributeWithSelections {
  id: string;
  name: string | null;
  slug: string | null;
  inputType: string | null;
  values: AttributeValueSelection[];
}

export interface GeneratorDefaults {
  stockQuantity: string;
  priceAmount: string;
}

export interface GeneratedVariantPreview {
  name: string;
  attributes: Array<{ attributeName: string; valueName: string }>;
  isExisting: boolean;
}

export interface ExistingVariantCombination {
  attributeId: string;
  valueSlug: string | null;
}

export interface ProductVariantGeneratorProps {
  open: boolean;
  onClose: () => void;
  variantAttributes: VariantAttributeFragment[];
  existingVariants: Array<{
    id: string;
    name: string;
    attributes: Array<{
      attribute: { id: string };
      values: Array<{ slug: string | null }>;
    }>;
  }>;
  onSubmit: (inputs: ProductVariantBulkCreateInput[]) => Promise<void>;
}

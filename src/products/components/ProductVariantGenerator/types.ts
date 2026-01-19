import {
  AttributeInputTypeEnum,
  ProductVariantBulkCreateInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";

export interface AttributeValue {
  id: string;
  name: string | null;
  slug: string | null;
  // Swatch fields
  file?: { url: string } | null;
  value?: string | null; // hex color for swatches
}

export interface AttributeData {
  id: string;
  name: string | null;
  slug: string | null;
  inputType: AttributeInputTypeEnum | null;
  values: AttributeValue[];
}

// Selection state is separate from attribute data
export type SelectionState = Record<string, Set<string>>; // attributeId -> Set of valueIds

export interface GeneratorDefaults {
  stockEnabled: boolean;
  stockQuantity: string;
  skuEnabled: boolean;
  skuPrefix: string;
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

// Reusable type for existing variant data needed for duplicate detection
export type ExistingVariantData = Array<{
  attributes: Array<{
    attribute: { id: string };
    values: Array<{ slug: string | null }>;
  }>;
}>;

export interface ProductVariantGeneratorProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  variantAttributes: VariantAttributeFragment[];
  existingVariants: ExistingVariantData;
  onSubmit: (inputs: ProductVariantBulkCreateInput[]) => Promise<void>;
}

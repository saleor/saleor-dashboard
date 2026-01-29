import {
  AttributeInputTypeEnum,
  ProductVariantBulkCreateInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

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

/** State for non-selection attributes (required attributes that apply to all variants) */
export type NonSelectionAttributeValues = Record<string, string[]>; // attributeId -> selected value slugs

/**
 * Attribute input types that can be set in the generator with simple widgets.
 *
 * Unsupported types that require manual setting after variant creation:
 * - FILE: Requires file upload
 * - MULTISELECT: Requires complex multi-value selection
 * - REFERENCE: Requires entity reference picker
 * - SINGLE_REFERENCE: Requires entity reference picker
 * - RICH_TEXT: Requires rich text editor
 */
export const GENERATOR_SUPPORTED_INPUT_TYPES = new Set([
  AttributeInputTypeEnum.DROPDOWN,
  AttributeInputTypeEnum.SWATCH,
  AttributeInputTypeEnum.BOOLEAN,
  AttributeInputTypeEnum.PLAIN_TEXT,
  AttributeInputTypeEnum.NUMERIC,
  AttributeInputTypeEnum.DATE,
  AttributeInputTypeEnum.DATE_TIME,
]);

/** Checks if an attribute input type is supported by the generator */
export const isGeneratorSupportedType = (
  inputType: AttributeInputTypeEnum | null | undefined,
): boolean => !!inputType && GENERATOR_SUPPORTED_INPUT_TYPES.has(inputType);

/** Filters required attributes that have unsupported types (these block the generator) */
export const getUnsupportedRequiredAttributes = <
  T extends { valueRequired: boolean; inputType: AttributeInputTypeEnum | null },
>(
  attributes: T[] | null | undefined,
): T[] =>
  (attributes ?? []).filter(
    attr => attr.valueRequired && !isGeneratorSupportedType(attr.inputType),
  );

/** Error details for a specific attribute from the bulk create mutation */
export interface AttributeError {
  attributeId: string;
  code: string;
  message: string | null;
}

/** Result of the bulk create operation */
export interface BulkCreateResult {
  success: boolean;
  successCount: number;
  failedCount: number;
  /** Errors specific to attributes (should be shown inline) */
  attributeErrors: AttributeError[];
  /** Other errors (can be shown as notifications) */
  otherErrors: Array<{ message: string | null }>;
}

export interface ProductVariantGeneratorProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  variantAttributes: VariantAttributeFragment[];
  /** Non-selection variant attributes (may include required ones that need default values) */
  nonSelectionVariantAttributes: VariantAttributeFragment[];
  existingVariants: ExistingVariantData;
  /** Search function for attribute values (used by DynamicCombobox for DROPDOWN attributes) */
  onAttributeValuesSearch: (attributeId: string, query: string) => Promise<Option[]>;
  /** Returns result with error details for inline display */
  onSubmit: (inputs: ProductVariantBulkCreateInput[]) => Promise<BulkCreateResult>;
}

import {
  type AttributeValueFragment,
  type PageErrorWithAttributesFragment,
  type ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { type FormsetChange } from "@dashboard/hooks/useFormset";
import { type FetchMoreProps, type ReorderEvent } from "@dashboard/types";
import { type RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";

import { type AttributeInput } from "./Attributes";

export enum VariantAttributeScope {
  ALL = "ALL",
  VARIANT_SELECTION = "VARIANT_SELECTION",
  NOT_VARIANT_SELECTION = "NOT_VARIANT_SELECTION",
}

export interface AttributeRowHandlers {
  onChange: FormsetChange<string | boolean>;
  onFileChange: FormsetChange<File>;
  onMultiChange: FormsetChange<string | string[]>;
  onReferencesAddClick: (attribute: AttributeInput) => void;
  onReferencesRemove: FormsetChange<string[]>;
  onReferencesReorder: FormsetChange<ReorderEvent>;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues: FetchMoreProps;
}

export interface AttributeRowProps extends AttributeRowHandlers {
  attribute: AttributeInput;
  attributeValues: AttributeValueFragment[];
  disabled: boolean;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  loading: boolean;
  onAttributeSelectBlur?: () => void;
  richTextGetters: RichTextGetters<string>;
}

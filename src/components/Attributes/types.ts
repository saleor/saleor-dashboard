import {
  AttributeValueFragment,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@saleor/graphql";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import { RichTextGetters } from "@saleor/utils/richText/useMultipleRichText";

import { AttributeInput } from "./Attributes";

export enum VariantAttributeScope {
  ALL = "ALL",
  VARIANT_SELECTION = "VARIANT_SELECTION",
  NOT_VARIANT_SELECTION = "NOT_VARIANT_SELECTION",
}

export interface AttributeRowHandlers {
  onChange: FormsetChange<string>;
  onFileChange: FormsetChange<File>;
  onMultiChange: FormsetChange<string>;
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

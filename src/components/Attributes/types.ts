import {
  type AccountErrorFragment,
  type AttributeValueFragment,
  type PageErrorWithAttributesFragment,
  type ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { type FormsetChange } from "@dashboard/hooks/useFormset";
import { type FetchMoreProps, type ReorderEvent } from "@dashboard/types";
import { type RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";

import { type AttributeReferenceView } from "./attributeReferenceLayout";
import { type AttributeInput } from "./Attributes";

export type AttributeFieldError =
  | ProductErrorWithAttributesFragment
  | PageErrorWithAttributesFragment
  | AccountErrorFragment;

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

/** `card` — full-bleed rows inside a `contentFlush` DetailSettingsCard. */
export type AttributeRowChrome = "legacy" | "card";

export interface AttributeRowProps extends AttributeRowHandlers {
  referenceLayoutView: AttributeReferenceView;
  /** Product type, model type, or customer type that owns this attribute set. */
  referenceTypeId?: string;
  /** Remembered open state for this attribute on `referenceTypeId`. Absent means collapsed. */
  referenceGroupExpanded?: boolean;
  onReferenceGroupExpandedChange?: (expanded: boolean) => void;
  /** Remembered list or packed mode for `referenceTypeId`. Absent means list. */
  referenceListView?: "list" | "packed";
  onReferenceListViewChange?: (mode: "list" | "packed") => void;
  attribute: AttributeInput;
  attributeValues: AttributeValueFragment[];
  disabled: boolean;
  error: AttributeFieldError | undefined;
  loading: boolean;
  onAttributeSelectBlur?: () => void;
  richTextGetters: RichTextGetters<string>;
}

import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type ListSettingsUpdate } from "@dashboard/components/TablePagination";
import { type LanguageFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { type Ripple } from "@dashboard/ripples/types";
import { type BulkTranslationSubmitResult } from "@dashboard/translations/bulkSubmitResult";
import { type ListSettings } from "@dashboard/types";
import { type OutputData } from "@editorjs/editorjs";

export enum TranslationInputFieldName {
  description = "description",
  name = "name",
  seoDescription = "seoDescription",
  seoTitle = "seoTitle",
  slug = "slug",
  richText = "richText",
}

export enum PageTranslationInputFieldName {
  content = "content",
  title = "title",
  seoDescription = "seoDescription",
  seoTitle = "seoTitle",
  slug = "slug",
  richText = "richText",
}

export const TranslationFieldType = {
  SHORT: "short",
  LONG: "long",
  RICH: "rich",
} as const;

export type TranslationFieldType = (typeof TranslationFieldType)[keyof typeof TranslationFieldType];

export interface TranslationField<T extends string = string> {
  id?: string;
  displayName: string;
  name: T;
  translation: string | null;
  /** Optional draft shown in edit inputs; persisted baseline remains in `translation`. */
  editInitial?: string | null;
  type: TranslationFieldType;
  value: string;
  hint?: string;
  ripple?: Ripple;
}

export const TranslationSubmitScope = {
  attribute: "attribute",
  attributeChoice: "attributeChoice",
  attributeValue: "attributeValue",
  entity: "entity",
} as const;

export type TranslationSubmitScope =
  (typeof TranslationSubmitScope)[keyof typeof TranslationSubmitScope];

export interface TranslationSectionConfig {
  id: string;
  title: string;
  subtitle?: string;
  fields: TranslationField[];
  submitScope: TranslationSubmitScope;
  pagination?: TranslationSectionPagination;
}

export interface TranslationSectionPagination {
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
}

export interface BulkTranslationValue {
  field: TranslationField;
  section: TranslationSectionConfig;
  data: string | OutputData;
}

export interface TranslationsEntitiesPageProps {
  translationId: string;
  activeField?: string | string[];
  bulk: boolean;
  disabled: boolean;
  languageCode: string;
  languages: LanguageFragment[];
  saveButtonState: ConfirmButtonTransitionState;
  onBulkChange: (bulk: boolean) => void;
  onEdit: (field: string | string[]) => void;
  onDiscard: (field?: string) => void;
  onSubmit: (field: TranslationField, data: string | OutputData) => SubmitPromise<any[]>;
  onBulkSubmit?: (values: BulkTranslationValue[]) => Promise<BulkTranslationSubmitResult>;
  fieldErrors?: Record<string, string>;
  onClearFieldError?: (fieldName: string) => void;
  onClearFieldErrors?: () => void;
}

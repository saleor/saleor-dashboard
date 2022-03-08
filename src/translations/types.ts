import { OutputData } from "@editorjs/editorjs";
import { LanguageFragment } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";

export enum TranslationInputFieldName {
  description = "description",
  name = "name",
  seoDescription = "seoDescription",
  seoTitle = "seoTitle",
  richText = "richText"
}

export enum PageTranslationInputFieldName {
  content = "content",
  title = "title",
  seoDescription = "seoDescription",
  seoTitle = "seoTitle",
  richText = "richText"
}

export interface TranslationField<T extends string = string> {
  id?: string;
  displayName: string;
  name: T;
  translation: string;
  type: "short" | "long" | "rich";
  value: string;
}

export interface TranslationsEntitiesPageProps {
  activeField: string;
  disabled: boolean;
  languageCode: string;
  languages: LanguageFragment[];
  saveButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
  onEdit: (field: string) => void;
  onDiscard: () => void;
  onLanguageChange: (lang: string) => void;
  onSubmit: (
    field: TranslationField,
    data: string | OutputData
  ) => SubmitPromise<any[]>;
}

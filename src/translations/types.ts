import { OutputData } from "@editorjs/editorjs";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ShopInfo_shop_languages } from "@saleor/components/Shop/types/ShopInfo";

export interface TranslationsEntitiesPageProps {
  activeField: string;
  disabled: boolean;
  languageCode: string;
  languages: ShopInfo_shop_languages[];
  saveButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
  onEdit: (field: string) => void;
  onDiscard: () => void;
  onLanguageChange: (lang: string) => void;
  onSubmit: (field: string, data: string | OutputData) => void;
}

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

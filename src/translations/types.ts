import { OutputData } from "@editorjs/editorjs";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ShopInfo_shop_languages } from "@saleor/components/Shop/types/ShopInfo";
import { SubmitPromise } from "@saleor/hooks/useForm";

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
  onSubmit: (field: string, data: string | OutputData) => SubmitPromise;
}

export enum TranslationInputFieldName {
  description = "description",
  name = "name",
  seoDescription = "seoDescription",
  seoTitle = "seoTitle"
}

export enum PageTranslationInputFieldName {
  content = "content",
  title = "title",
  seoDescription = "seoDescription",
  seoTitle = "seoTitle"
}

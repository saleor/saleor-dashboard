import {
  type LanguageCodeEnum,
  type MenuItemTranslationFragment,
  useMenuItemTranslationDetailsQuery,
  useUpdateMenuItemTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsMenuItemPage } from "../components/TranslationsMenuItemPage/TranslationsMenuItemPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsMenuItemQueryParams extends TranslationDetailQueryParams {}

interface TranslationsMenuItemProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsMenuItemQueryParams;
}

const TranslationsMenuItem = ({ id, languageCode, params }: TranslationsMenuItemProps) => {
  const menuItemTranslations = useMenuItemTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateMenuItemTranslationsMutation();
  const viewProps = useTranslationEntityView<MenuItemTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "MenuItemTranslatableContent",
    detailsQuery: menuItemTranslations,
    entityMutation,
  });

  return <TranslationsMenuItemPage translationId={id} {...viewProps} />;
};

TranslationsMenuItem.displayName = "TranslationsMenuItem";
export { TranslationsMenuItem };

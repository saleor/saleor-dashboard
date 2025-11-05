// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { CategoryTranslationFragment, LanguageCodeEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps,
} from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

interface TranslationsCategoriesPageProps extends TranslationsEntitiesPageProps {
  data: CategoryTranslationFragment;
}

const TranslationsCategoriesPage = ({
  translationId,
  activeField,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  onDiscard,
  onEdit,
  onSubmit,
}: TranslationsCategoriesPageProps) => {
  const intl = useIntl();
  const { TRANSLATIONS_MORE_ACTIONS } = useExtensions(["TRANSLATIONS_MORE_ACTIONS"]);
  const menuItems = getExtensionsItemsForTranslationDetails(TRANSLATIONS_MORE_ACTIONS, {
    translationContext: "category",
    categoryId: data?.category?.id,
    translationLanguage: languageCode,
  });

  const navigate = useNavigator();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.categories,
        })}
        title={intl.formatMessage(
          {
            id: "XitW/z",
            defaultMessage: 'Translation Category "{categoryName}" - {languageCode}',
          },
          {
            categoryName: getStringOrPlaceholder(data?.category?.name),
            languageCode,
          },
        )}
      >
        <Box display="flex" gap={3}>
          {menuItems.length > 0 && (
            <ExtensionsButtonSelector
              extensions={menuItems}
              onClick={extension => {
                extension.onSelect({
                  translationContext: "category",
                  categoryId: data?.category?.id,
                  translationLanguage: languageCode,
                });
              }}
            />
          )}
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang =>
              navigate(languageEntityUrl(lang, TranslatableEntities.categories, translationId))
            }
          />
        </Box>
      </TopNav>
      <DetailPageLayout.Content>
        <TranslationFields
          activeField={activeField}
          disabled={disabled}
          initialState={true}
          title={intl.formatMessage(commonMessages.generalInformations)}
          fields={[
            {
              displayName: intl.formatMessage({
                id: "vEYtiq",
                defaultMessage: "Category Name",
              }),
              name: TranslationInputFieldName.name,
              translation: data?.translation?.name || null,
              type: "short" as const,
              value: data?.category?.name,
            },
            {
              displayName: intl.formatMessage(commonMessages.description),
              name: TranslationInputFieldName.description,
              translation: data?.translation?.description || null,
              type: "rich" as const,
              value: data?.category?.description,
            },
          ]}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onSubmit={onSubmit}
        />
        <CardSpacer />
        <TranslationFields
          activeField={activeField}
          disabled={disabled}
          initialState={true}
          title={intl.formatMessage({
            id: "TGX4T1",
            defaultMessage: "Search Engine Preview",
          })}
          fields={[
            {
              displayName: intl.formatMessage({
                id: "HlEpii",
                defaultMessage: "Search Engine Title",
              }),
              name: TranslationInputFieldName.seoTitle,
              translation: data?.translation?.seoTitle || null,
              type: "short" as const,
              value: data?.category?.seoTitle,
            },
            {
              displayName: intl.formatMessage({
                id: "US3IPU",
                defaultMessage: "Search Engine Description",
              }),
              name: TranslationInputFieldName.seoDescription,
              translation: data?.translation?.seoDescription || null,
              type: "long" as const,
              value: data?.category?.seoDescription,
            },
          ]}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onSubmit={onSubmit}
        />
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsCategoriesPage.displayName = "TranslationsCategoriesPage";
export default TranslationsCategoriesPage;

// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type CategoryTranslationFragment, LanguageCodeEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsDetailLayout } from "@dashboard/translations/components/TranslationsDetailLayout/TranslationsDetailLayout";
import {
  createGeneralNameDescriptionSection,
  createSeoTranslationSection,
} from "@dashboard/translations/translationSectionBuilders";
import { type TranslationsEntitiesPageProps } from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

interface TranslationsCategoriesPageProps extends TranslationsEntitiesPageProps {
  data: CategoryTranslationFragment | null;
}

export const TranslationsCategoriesPage = ({
  translationId,
  activeField,
  bulk,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  fieldErrors,
  onBulkChange,
  onBulkSubmit,
  onClearFieldError,
  onClearFieldErrors,
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
  const sections = useMemo(
    () => [
      createGeneralNameDescriptionSection(intl, {
        description: data?.category?.description,
        name: data?.category?.name,
        translationDescription: data?.translation?.description,
        translationName: data?.translation?.name,
      }),
      createSeoTranslationSection(intl, {
        seoDescription: data?.category?.seoDescription,
        seoTitle: data?.category?.seoTitle,
        slug: data?.category?.slug,
        translationSeoDescription: data?.translation?.seoDescription,
        translationSeoTitle: data?.translation?.seoTitle,
        translationSlug: data?.translation?.slug,
      }),
    ],
    [data, intl],
  );

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={bulk}>
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
        <TranslationsDetailLayout
          sections={sections}
          activeField={activeField}
          bulk={bulk}
          disabled={disabled}
          languageCode={languageCode}
          languages={languages}
          saveButtonState={saveButtonState}
          fieldErrors={fieldErrors}
          onBulkChange={onBulkChange}
          onBulkSubmit={onBulkSubmit}
          onClearFieldError={onClearFieldError}
          onClearFieldErrors={onClearFieldErrors}
          onDiscard={onDiscard}
          onEdit={onEdit}
          onSubmit={onSubmit}
        />
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsCategoriesPage.displayName = "TranslationsCategoriesPage";

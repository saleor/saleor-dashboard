// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { LanguageCodeEnum, type PageTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsDetailLayout } from "@dashboard/translations/components/TranslationsDetailLayout/TranslationsDetailLayout";
import { isAttributeValueTranslationField } from "@dashboard/translations/translationFieldRouting";
import {
  createAttributeValuesSection,
  createPageGeneralSection,
  createSeoTranslationSection,
} from "@dashboard/translations/translationSectionBuilders";
import { type TranslationsEntitiesPageProps } from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { mapAttributeValuesToTranslationFields } from "@dashboard/translations/utils";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

interface TranslationsPagesPageProps extends TranslationsEntitiesPageProps {
  data: PageTranslationFragment | null;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

export const TranslationsPagesPage = ({
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
  onAttributeValueSubmit,
}: TranslationsPagesPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { TRANSLATIONS_MORE_ACTIONS } = useExtensions(["TRANSLATIONS_MORE_ACTIONS"]);
  const menuItems = getExtensionsItemsForTranslationDetails(TRANSLATIONS_MORE_ACTIONS, {
    translationContext: "model",
    pageId: data?.page?.id,
    translationLanguage: languageCode,
  });

  const sections = useMemo(() => {
    const pageSections = [
      createPageGeneralSection(intl, {
        content: data?.page?.content,
        title: data?.page?.title,
        translationContent: data?.translation?.content,
        translationTitle: data?.translation?.title,
      }),
      createSeoTranslationSection(intl, {
        seoDescription: data?.page?.seoDescription,
        seoTitle: data?.page?.seoTitle,
        slug: data?.page?.slug,
        translationSeoDescription: data?.translation?.seoDescription,
        translationSeoTitle: data?.translation?.seoTitle,
        translationSlug: data?.translation?.slug,
      }),
    ];

    if (data?.attributeValues?.length > 0) {
      pageSections.push(
        createAttributeValuesSection(
          intl,
          mapAttributeValuesToTranslationFields(data.attributeValues, intl),
        ),
      );
    }

    return pageSections;
  }, [data, intl]);

  const handleSubmit = (field, submitData) => {
    if (isAttributeValueTranslationField(field, sections)) {
      return onAttributeValueSubmit(field, submitData);
    }

    return onSubmit(field, submitData);
  };

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={bulk}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.pages,
        })}
        title={intl.formatMessage(
          {
            id: "oUWXLO",
            defaultMessage: 'Translation Page "{pageName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            pageName: getStringOrPlaceholder(data?.page?.title),
          },
        )}
      >
        <Box display="flex" gap={3}>
          {menuItems.length > 0 && (
            <ExtensionsButtonSelector
              extensions={menuItems}
              onClick={extension => {
                extension.onSelect({
                  translationContext: "model",
                  pageId: data?.page?.id,
                  translationLanguage: languageCode,
                });
              }}
            />
          )}
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang =>
              navigate(languageEntityUrl(lang, TranslatableEntities.pages, translationId))
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
          onSubmit={handleSubmit}
        />
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsPagesPage.displayName = "TranslationsPagesPage";

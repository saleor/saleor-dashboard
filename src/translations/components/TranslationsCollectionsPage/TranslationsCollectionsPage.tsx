// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type CollectionTranslationFragment, LanguageCodeEnum } from "@dashboard/graphql";
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

interface TranslationsCollectionsPageProps extends TranslationsEntitiesPageProps {
  data: CollectionTranslationFragment | null;
}

export const TranslationsCollectionsPage = ({
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
}: TranslationsCollectionsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { TRANSLATIONS_MORE_ACTIONS } = useExtensions(["TRANSLATIONS_MORE_ACTIONS"]);
  const menuItems = getExtensionsItemsForTranslationDetails(TRANSLATIONS_MORE_ACTIONS, {
    translationContext: "collection",
    collectionId: data?.collection?.id,
    translationLanguage: languageCode,
  });
  const sections = useMemo(
    () => [
      createGeneralNameDescriptionSection(
        intl,
        {
          description: data?.collection?.description,
          name: data?.collection?.name,
          translationDescription: data?.translation?.description,
          translationName: data?.translation?.name,
        },
        {
          nameLabel: intl.formatMessage({
            id: "VZsE96",
            defaultMessage: "Collection Name",
          }),
        },
      ),
      createSeoTranslationSection(intl, {
        seoDescription: data?.collection?.seoDescription,
        seoTitle: data?.collection?.seoTitle,
        translationSeoDescription: data?.translation?.seoDescription,
        translationSeoTitle: data?.translation?.seoTitle,
      }),
    ],
    [data, intl],
  );

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={bulk}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.collections,
        })}
        title={intl.formatMessage(
          {
            id: "Bphmwe",
            defaultMessage: 'Translation Collection "{collectionName}" - {languageCode}',
            description: "header",
          },
          {
            collectionName: getStringOrPlaceholder(data?.collection?.name),
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
                  translationContext: "collection",
                  collectionId: data?.collection?.id,
                  translationLanguage: languageCode,
                });
              }}
            />
          )}
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang =>
              navigate(languageEntityUrl(lang, TranslatableEntities.collections, translationId))
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

TranslationsCollectionsPage.displayName = "TranslationsCollectionsPage";

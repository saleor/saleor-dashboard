// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type ListSettingsUpdate } from "@dashboard/components/TablePagination";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type AttributeTranslationDetailsFragment, LanguageCodeEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsDetailLayout } from "@dashboard/translations/components/TranslationsDetailLayout/TranslationsDetailLayout";
import {
  TranslationFieldType,
  type TranslationSectionConfig,
  type TranslationsEntitiesPageProps,
  TranslationSubmitScope,
} from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { getTranslationFields } from "@dashboard/translations/utils";
import { type ListSettings } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { transtionsAttributesPageFieldsMessages as messages } from "./messages";

interface TranslationsAttributesPageProps extends TranslationsEntitiesPageProps {
  data: AttributeTranslationDetailsFragment | null;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
}

export const fieldNames = {
  attribute: "attribute",
  value: "attributeValue",
  richTextValue: "attributeRichTextValue",
};

export const TranslationsAttributesPage = ({
  translationId,
  activeField,
  bulk,
  disabled,
  languages,
  languageCode,
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
  settings,
  onUpdateListSettings,
}: TranslationsAttributesPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const withChoices = data?.attribute?.withChoices;
  const { TRANSLATIONS_MORE_ACTIONS } = useExtensions(["TRANSLATIONS_MORE_ACTIONS"]);
  const menuItems = getExtensionsItemsForTranslationDetails(TRANSLATIONS_MORE_ACTIONS, {
    translationContext: "attribute",
    translationLanguage: languageCode,
    attributeId: data?.attribute?.id,
  });
  const sections = useMemo(() => {
    if (!data?.attribute) {
      return [];
    }

    const attributeSections: TranslationSectionConfig[] = [
      {
        id: "general",
        submitScope: TranslationSubmitScope.attribute,
        subtitle: intl.formatMessage({
          id: "ywLJ93",
          defaultMessage: "The attribute label shown in your storefront",
          description: "attribute translation section subtitle",
        }),
        title: intl.formatMessage(commonMessages.generalInformations),
        fields: [
          {
            displayName: intl.formatMessage({
              id: "DRMMDs",
              defaultMessage: "Attribute Name",
            }),
            name: `${fieldNames.attribute}:${data.attribute.id}`,
            translation: data.translation?.name || null,
            type: TranslationFieldType.SHORT,
            value: data.attribute.name ?? "",
          },
        ],
      },
    ];

    const choiceEdges = data.attribute.choices?.edges;

    if (withChoices && (choiceEdges?.length ?? 0) > 0 && data.attribute.choices) {
      attributeSections.push({
        id: "choices",
        submitScope: TranslationSubmitScope.attributeChoice,
        subtitle: intl.formatMessage(messages.valuesSubtitle),
        title: intl.formatMessage(messages.values),
        fields: getTranslationFields(data.attribute.choices, intl),
        pagination: {
          onUpdateListSettings,
          settings,
        },
      });
    }

    return attributeSections;
  }, [data, intl, onUpdateListSettings, settings, withChoices]);

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={bulk}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.attributes,
        })}
        title={intl.formatMessage(
          {
            id: "SPBLzT",
            defaultMessage: 'Translation Attribute "{attribute}" - {languageCode}',
            description: "header",
          },
          {
            attribute: getStringOrPlaceholder(data?.attribute?.name),
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
                  translationContext: "attribute",
                  translationLanguage: languageCode,
                  attributeId: data?.attribute?.id,
                });
              }}
            />
          )}
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang =>
              navigate(languageEntityUrl(lang, TranslatableEntities.attributes, translationId))
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

TranslationsAttributesPage.displayName = "TranslationsAttributesPage";

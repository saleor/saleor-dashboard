// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { LanguageCodeEnum, type ShippingMethodTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsDetailLayout } from "@dashboard/translations/components/TranslationsDetailLayout/TranslationsDetailLayout";
import { createGeneralNameDescriptionSection } from "@dashboard/translations/translationSectionBuilders";
import { type TranslationsEntitiesPageProps } from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

interface TranslationsShippingMethodPageProps extends TranslationsEntitiesPageProps {
  data: ShippingMethodTranslationFragment | null;
}

export const TranslationsShippingMethodPage = ({
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
}: TranslationsShippingMethodPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { TRANSLATIONS_MORE_ACTIONS } = useExtensions(["TRANSLATIONS_MORE_ACTIONS"]);
  const menuItems = getExtensionsItemsForTranslationDetails(TRANSLATIONS_MORE_ACTIONS, {
    translationContext: "shipping-method",
    shippingMethodId: data?.shippingMethod?.id,
    translationLanguage: languageCode,
  });
  const sections = useMemo(
    () => [
      createGeneralNameDescriptionSection(
        intl,
        {
          description: data?.description,
          name: data?.name,
          translationDescription: data?.translation?.description,
          translationName: data?.translation?.name,
        },
        {
          descriptionLabel: intl.formatMessage({
            id: "GpqEl5",
            defaultMessage: "Description",
            description: "shipping method description",
          }),
          nameLabel: intl.formatMessage({
            id: "aPCrsp",
            defaultMessage: "Name",
            description: "shipping method name",
          }),
        },
      ),
    ],
    [data, intl],
  );

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={bulk}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.shippingMethods,
        })}
        title={intl.formatMessage(
          {
            id: "1UKx20",
            defaultMessage: 'Translation ShippingMethod "{shippingMethodName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            shippingMethodName: getStringOrPlaceholder(data?.name),
          },
        )}
      >
        <Box display="flex" gap={3}>
          {menuItems.length > 0 && (
            <ExtensionsButtonSelector
              extensions={menuItems}
              onClick={extension => {
                extension.onSelect({
                  translationContext: "shipping-method",
                  shippingMethodId: data?.shippingMethod?.id,
                  translationLanguage: languageCode,
                });
              }}
            />
          )}
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang =>
              navigate(languageEntityUrl(lang, TranslatableEntities.shippingMethods, translationId))
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

TranslationsShippingMethodPage.displayName = "TranslationsShippingMethodPage";

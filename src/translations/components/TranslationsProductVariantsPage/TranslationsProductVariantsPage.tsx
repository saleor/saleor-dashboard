// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { LanguageCodeEnum, type ProductVariantTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsDetailLayout } from "@dashboard/translations/components/TranslationsDetailLayout/TranslationsDetailLayout";
import { isAttributeValueTranslationField } from "@dashboard/translations/translationFieldRouting";
import {
  createAttributeValuesSection,
  createSingleNameSection,
} from "@dashboard/translations/translationSectionBuilders";
import {
  type TranslationField,
  type TranslationsEntitiesPageProps,
} from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  productVariantUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { mapAttributeValuesToTranslationFields } from "@dashboard/translations/utils";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { ProductContextSwitcher } from "../ProductContextSwitcher/ProductContextSwitcher";

interface TranslationsProductVariantsPageProps extends TranslationsEntitiesPageProps {
  data: ProductVariantTranslationFragment | null;
  productId: string;
  variantId: string;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

export const TranslationsProductVariantsPage = ({
  translationId,
  activeField,
  bulk,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  fieldErrors,
  productId,
  variantId,
  onBulkChange,
  onBulkSubmit,
  onClearFieldError,
  onClearFieldErrors,
  onDiscard,
  onEdit,
  onSubmit,
  onAttributeValueSubmit,
}: TranslationsProductVariantsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const sections = useMemo(() => {
    const variantSections = [
      createSingleNameSection(
        intl,
        {
          name: data?.name,
          translationName: data?.translation?.name,
        },
        {
          nameLabel: intl.formatMessage({
            id: "T1f2Yl",
            defaultMessage: "Variant Name",
          }),
        },
      ),
    ];

    if (data?.attributeValues?.length > 0) {
      variantSections.push(
        createAttributeValuesSection(
          intl,
          mapAttributeValuesToTranslationFields(data.attributeValues, intl),
        ),
      );
    }

    return variantSections;
  }, [data, intl]);

  const handleSubmit = (field: TranslationField, submitData) => {
    if (isAttributeValueTranslationField(field, sections)) {
      return onAttributeValueSubmit(field, submitData);
    }

    return onSubmit(field, submitData);
  };

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={bulk}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.products,
        })}
        title={intl.formatMessage(
          {
            id: "98WMlR",
            defaultMessage: 'Translation Product Variant "{productName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(data?.name),
          },
        )}
      >
        <Box display="flex" gap={3}>
          <ProductContextSwitcher
            onItemChange={(id, type) => {
              if (type === "main") {
                navigate(languageEntityUrl(languageCode, TranslatableEntities.products, productId));
              } else if (type === "variant") {
                navigate(productVariantUrl(languageCode, productId, id));
              } else {
                throw new Error("Invalid type, must be main or variant");
              }
            }}
            productId={productId}
            selectedId={variantId}
            selectedVariant={
              data
                ? {
                    id: variantId,
                    name: data.name,
                    sku: null,
                  }
                : null
            }
          />
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang => navigate(productVariantUrl(lang, productId, translationId))}
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

TranslationsProductVariantsPage.displayName = "TranslationsProductVariantsPage";

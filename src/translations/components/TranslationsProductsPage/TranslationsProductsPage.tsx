// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { LanguageCodeEnum, type ProductTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsDetailLayout } from "@dashboard/translations/components/TranslationsDetailLayout/TranslationsDetailLayout";
import { createProductTranslateFormPayloadEvent } from "@dashboard/translations/components/TranslationsProductsPage/create-product-translate-form-payload-event";
import { isAttributeValueTranslationField } from "@dashboard/translations/translationFieldRouting";
import {
  createAttributeValuesSection,
  createGeneralNameDescriptionSection,
  createSeoTranslationSection,
} from "@dashboard/translations/translationSectionBuilders";
import {
  type TranslationField,
  TranslationInputFieldName,
  type TranslationSectionConfig,
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
import { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import { ProductContextSwitcher } from "../ProductContextSwitcher/ProductContextSwitcher";
import { useTranslationProductFormAppResponse } from "./use-translation-product-form-app-response";
import { useTranslationsProductsDataCache } from "./use-translations-products-data-cache";

interface ProductAppResponseFields {
  productDescription?: string;
  productName?: string;
  seoDescription?: string;
  seoName?: string;
}

const applyProductAppDraftsToSections = (
  sections: TranslationSectionConfig[],
  appResponseFields: ProductAppResponseFields,
): TranslationSectionConfig[] =>
  sections.map(section => ({
    ...section,
    fields: section.fields.map(field => {
      const draftByFieldName: Record<string, string | undefined> = {
        [TranslationInputFieldName.name]: appResponseFields.productName,
        [TranslationInputFieldName.description]: appResponseFields.productDescription,
        [TranslationInputFieldName.seoDescription]: appResponseFields.seoDescription,
        [TranslationInputFieldName.seoTitle]: appResponseFields.seoName,
      };
      const draft = draftByFieldName[field.name];

      if (!draft) {
        return field;
      }

      return {
        ...field,
        editInitial: draft,
      };
    }),
  }));

interface TranslationsProductsPageProps extends TranslationsEntitiesPageProps {
  data: ProductTranslationFragment | null;
  productId: string;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

export const TranslationsProductsPage = ({
  translationId,
  productId,
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
}: TranslationsProductsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { TRANSLATIONS_MORE_ACTIONS } = useExtensions(["TRANSLATIONS_MORE_ACTIONS"]);
  const menuItems = getExtensionsItemsForTranslationDetails(TRANSLATIONS_MORE_ACTIONS, {
    translationContext: "product",
    productId,
    translationLanguage: languageCode,
  });
  const { attachFormState, active } = useActiveAppExtension();
  const {
    resetCache,
    cachedProductName,
    cachedProductDescription,
    cachedProductSeoDescription,
    cachedProductSeoName,
    setCachedFormField,
  } = useTranslationsProductsDataCache();
  const { appResponseFields, resetKey } = useTranslationProductFormAppResponse({
    productData: data?.product,
    cachedProductDescription,
    cachedProductSeoName,
    cachedProductSeoDescription,
    cachedProductName,
    onEdit,
  });

  const sections = useMemo((): TranslationSectionConfig[] => {
    const productSections: TranslationSectionConfig[] = [
      createGeneralNameDescriptionSection(
        intl,
        {
          description: data?.product?.description,
          name: data?.product?.name,
          translationDescription: data?.translation?.description ?? null,
          translationName: data?.translation?.name ?? null,
        },
        {
          descriptionLabel: intl.formatMessage({
            id: "Q8Qw5B",
            defaultMessage: "Description",
          }),
          nameLabel: intl.formatMessage({
            id: "ZIc5lM",
            defaultMessage: "Product Name",
          }),
        },
      ),
      createSeoTranslationSection(intl, {
        seoDescription: data?.product?.seoDescription,
        seoTitle: data?.product?.seoTitle,
        translationSeoDescription: data?.translation?.seoDescription ?? null,
        translationSeoTitle: data?.translation?.seoTitle ?? null,
      }),
    ];

    if (data?.attributeValues?.length > 0) {
      productSections.push(
        createAttributeValuesSection(
          intl,
          mapAttributeValuesToTranslationFields(data.attributeValues, intl),
        ),
      );
    }

    return applyProductAppDraftsToSections(productSections, appResponseFields);
  }, [appResponseFields, data, intl]);

  const handleValueChange = (field: TranslationField, value: string): void => {
    if (field.name === TranslationInputFieldName.name) {
      setCachedFormField("productName", value);
    }

    if (field.name === TranslationInputFieldName.description) {
      setCachedFormField("productDescription", value);
    }

    if (field.name === TranslationInputFieldName.seoDescription) {
      setCachedFormField("seoDescription", value);
    }

    if (field.name === TranslationInputFieldName.seoTitle) {
      setCachedFormField("seoName", value);
    }
  };

  const handleSubmit = (field: TranslationField, submitData) => {
    if (isAttributeValueTranslationField(field, sections)) {
      return onAttributeValueSubmit(field, submitData);
    }

    return onSubmit(field, submitData);
  };

  useEffect(() => {
    if (active && data?.product) {
      attachFormState(
        createProductTranslateFormPayloadEvent({
          translationData: data.translation,
          productData: data.product,
          cachedProductDescription,
          cachedProductName,
          cachedProductSeoName,
          cachedProductSeoDescription,
          productId,
          languageCode,
        }),
      );
    }
  }, [active, data?.product, productId]);

  useEffect(() => {
    resetCache();
  }, [activeField]);

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={bulk}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.products,
        })}
        title={intl.formatMessage(
          {
            id: "22x9tu",
            defaultMessage: 'Translation Product "{productName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(data?.product?.name),
          },
        )}
      >
        <Box display="flex" gap={3}>
          {menuItems.length > 0 && (
            <ExtensionsButtonSelector
              extensions={menuItems}
              onClick={extension => {
                extension.onSelect({
                  translationContext: "product",
                  productId,
                  translationLanguage: languageCode,
                });
              }}
            />
          )}
          <ProductContextSwitcher
            productId={productId}
            selectedId={productId}
            onItemChange={(id, type) => {
              if (type === "main") {
                navigate(languageEntityUrl(languageCode, TranslatableEntities.products, productId));
              } else if (type === "variant") {
                navigate(productVariantUrl(languageCode, productId, id));
              } else {
                throw new Error("Invalid type, must be main or variant");
              }
            }}
          />
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang => {
              navigate(languageEntityUrl(lang, TranslatableEntities.products, translationId));
            }}
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
          richTextResetKey={`${languageCode}_${resetKey.current}`}
          saveButtonState={saveButtonState}
          fieldErrors={fieldErrors}
          onBulkChange={onBulkChange}
          onBulkSubmit={onBulkSubmit}
          onClearFieldError={onClearFieldError}
          onClearFieldErrors={onClearFieldErrors}
          onDiscard={onDiscard}
          onEdit={onEdit}
          onSubmit={handleSubmit}
          onValueChange={handleValueChange}
        />
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsProductsPage.displayName = "TranslationsProductsPage";

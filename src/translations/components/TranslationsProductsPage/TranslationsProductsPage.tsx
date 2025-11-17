// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { ExtensionsButtonSelector } from "@dashboard/extensions/components/ExtensionsButtonSelector/ExtensionsButtonSelector";
import { getExtensionsItemsForTranslationDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { LanguageCodeEnum, ProductTranslationFragment } from "@dashboard/graphql";
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
  productVariantUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { mapAttributeValuesToTranslationFields } from "@dashboard/translations/utils";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { ProductContextSwitcher } from "../ProductContextSwitcher/ProductContextSwitcher";
import TranslationFields from "../TranslationFields";

interface TranslationsProductsPageProps extends TranslationsEntitiesPageProps {
  data: ProductTranslationFragment;
  productId: string;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsProductsPage = ({
  translationId,
  productId,
  activeField,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
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
  const { attachFormState, active, framesByFormType } = useActiveAppExtension();
  // A hack to access field that are currently being edited in nested form.
  const dataCache = useRef<
    Record<"productName" | "productDescription" | "seoDescription" | "seoName", string | null>
  >({
    productName: null,
    productDescription: null,
    seoDescription: null,
    seoName: null,
  });

  // Emit data to app
  useEffect(() => {
    if (active && data?.product) {
      attachFormState({
        translationLanguage: languageCode,
        form: "product-translate",
        productId: productId,
        fields: {
          productName: {
            type: "short-text",
            fieldName: "productName",
            originalValue: data.product.name,
            currentValue: dataCache.current.productName ?? data.product.name ?? "",
            translatedValue: data.translation?.name ?? "",
          },
          productDescription: {
            currentValue: dataCache.current.productDescription ?? data.product.description ?? "",
            type: "editorjs",
            fieldName: "productDescription",
            originalValue: data.product.description,
            translatedValue: data.translation?.description ?? "",
          },
          seoName: {
            type: "short-text",
            fieldName: "seoName",
            originalValue: data.product.seoTitle,
            currentValue: dataCache.current.seoName ?? data.product.seoTitle ?? "",
            translatedValue: data.translation?.seoTitle ?? "",
          },
          seoDescription: {
            currentValue: dataCache.current.seoDescription ?? data.product.seoDescription ?? "",
            type: "long-text",
            fieldName: "seoDescription",
            originalValue: data.product.seoDescription,
            translatedValue: data.translation?.seoDescription ?? "",
          },
        },
      });
    }
  }, [active, data?.product, productId]);

  const extensionResponseFrames = framesByFormType["product-translate"];

  const lastFrame = extensionResponseFrames
    ? extensionResponseFrames[extensionResponseFrames.length - 1]
    : null;

  // todo maybe extract to hook and test
  useEffect(() => {
    if (!lastFrame) {
      return;
    }

    const { productName, productDescription, seoDescription, seoName } = lastFrame.fields;
    const dirtyFields: TranslationInputFieldName[] = [];

    if (productName?.value !== (dataCache.current.productName ?? data?.product?.name)) {
      dirtyFields.push(TranslationInputFieldName.name);
    }

    if (
      productDescription?.value !==
      (dataCache.current.productDescription ?? data?.product?.description)
    ) {
      dirtyFields.push(TranslationInputFieldName.description);
    }

    if (
      seoDescription?.value !== (dataCache.current?.seoDescription ?? data?.product?.seoDescription)
    ) {
      dirtyFields.push(TranslationInputFieldName.seoDescription);
    }

    if (seoName?.value !== (dataCache.current.seoName ?? data?.product?.seoTitle)) {
      dirtyFields.push(TranslationInputFieldName.seoTitle);
    }

    onEdit(dirtyFields);
  }, [lastFrame, data?.product]);

  useEffect(() => {
    dataCache.current = {
      productName: null,
      productDescription: null,
      seoName: null,
      seoDescription: null,
    };
  }, [activeField]);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
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
        <TranslationFields
          onValueChange={(field, value) => {
            if (field.name === "name") {
              dataCache.current.productName = value;
            }

            if (field.name === "description") {
              dataCache.current.productDescription = value;
            }

            if (field.name === "seoDescription") {
              dataCache.current.seoDescription = value;
            }

            if (field.name === "seoTitle") {
              dataCache.current.seoName = value;
            }
          }}
          activeField={activeField}
          disabled={disabled}
          initialState={true}
          title={intl.formatMessage(commonMessages.generalInformations)}
          fields={[
            {
              displayName: intl.formatMessage({
                id: "ZIc5lM",
                defaultMessage: "Product Name",
              }),
              name: TranslationInputFieldName.name,
              translation:
                (lastFrame?.fields.productName?.value ?? data?.translation?.name) || null,
              type: "short",
              value: data?.product?.name,
            },
            {
              displayName: intl.formatMessage({
                id: "Q8Qw5B",
                defaultMessage: "Description",
              }),
              name: TranslationInputFieldName.description,
              translation:
                (lastFrame?.fields.productDescription?.value ?? data?.translation?.description) ||
                null,
              type: "rich",
              value: data?.product?.description,
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
          onValueChange={(field, value) => {
            if (field.name === "name") {
              dataCache.current.productName = value;
            }

            if (field.name === "description") {
              dataCache.current.productDescription = value;
            }

            if (field.name === "seoDescription") {
              dataCache.current.seoDescription = value;
            }

            if (field.name === "seoTitle") {
              dataCache.current.seoName = value;
            }
          }}
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
              translation:
                (lastFrame?.fields.seoName?.value ?? data?.translation?.seoTitle) || null,
              type: "short",
              value: data?.product?.seoTitle,
            },
            {
              displayName: intl.formatMessage({
                id: "US3IPU",
                defaultMessage: "Search Engine Description",
              }),
              name: TranslationInputFieldName.seoDescription,
              translation:
                (lastFrame?.fields.seoDescription?.value ?? data?.translation?.seoDescription) ||
                null,
              type: "long",
              value: data?.product?.seoDescription,
            },
          ]}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode + JSON.stringify(lastFrame)}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onSubmit={onSubmit}
        />
        <CardSpacer />
        {data?.attributeValues?.length > 0 && (
          <>
            <TranslationFields
              activeField={activeField}
              disabled={disabled}
              initialState={true}
              title={intl.formatMessage(commonMessages.translationAttributes)}
              fields={mapAttributeValuesToTranslationFields(data.attributeValues, intl)}
              saveButtonState={saveButtonState}
              richTextResetKey={languageCode + JSON.stringify(lastFrame)}
              onEdit={onEdit}
              onDiscard={onDiscard}
              onSubmit={onAttributeValueSubmit}
            />
            <CardSpacer />
          </>
        )}
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsProductsPage.displayName = "TranslationsProductsPage";
export default TranslationsProductsPage;

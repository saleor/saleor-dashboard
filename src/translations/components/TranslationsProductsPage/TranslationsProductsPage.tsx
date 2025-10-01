// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { useExternalApp } from "@dashboard/extensions/components/ExternalAppContext";
import {
  translateProductFormStateAtom,
  translateProductFromAppResponseAtom,
} from "@dashboard/extensions/form-context-state";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  AppExtensionMountEnum,
  LanguageCodeEnum,
  ProductTranslationFragment,
} from "@dashboard/graphql";
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
import { Box, Button } from "@saleor/macaw-ui-next";
import { useAtom } from "jotai";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
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
  const { TRANSLATION_PRODUCT_FORM: formExtensionsList } = useExtensions([
    AppExtensionMountEnum.TRANSLATION_PRODUCT_FORM,
  ]);
  const [, setFormStateForExtension] = useAtom(translateProductFormStateAtom);
  const [responseFromApp, setResponseFromApp] = useAtom(translateProductFromAppResponseAtom);
  const { closeApp } = useExternalApp();

  useEffect(() => {
    return () => {
      setFormStateForExtension(null);
      setResponseFromApp(null);
    };
  }, []);

  useEffect(() => {
    if (!responseFromApp) {
      return;
    }

    onEdit([
      TranslationInputFieldName.name,
      TranslationInputFieldName.description,
      TranslationInputFieldName.seoTitle,
      TranslationInputFieldName.seoDescription,
    ]);

    closeApp();
  }, [responseFromApp]);

  // todo broken display of description

  useEffect(() => {
    setFormStateForExtension({
      formId: "translate-product",
      translationLanguage: languageCode,
      productId,
      fields: [
        {
          fieldName: TranslationInputFieldName.name,
          translatedValue: data?.translation?.name ?? "",
          originalValue: data?.product?.name ?? "",
          type: "short",
        },
        {
          fieldName: TranslationInputFieldName.description,
          translatedValue: data?.translation?.description ?? "",
          originalValue: data?.product?.description ?? "",
          type: "rich",
        },
        {
          fieldName: TranslationInputFieldName.seoTitle,
          translatedValue: data?.translation?.seoTitle ?? "",
          originalValue: data?.product?.seoTitle ?? "",
          type: "short",
        },
        {
          fieldName: TranslationInputFieldName.seoDescription,
          translatedValue: data?.translation?.seoDescription ?? "",
          originalValue: data?.product?.seoDescription ?? "",
          type: "short", //todo change to long? or plain / rich
        },
      ],
    });
  }, [setFormStateForExtension, languageCode, data, productId]);

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
          {/*TODO: This should be rendered by app extension mount. How to figure out many apps on this mount? Can app set its own icon? */}
          {formExtensionsList.length > 0 && (
            <Button
              onClick={() => {
                formExtensionsList[0].open();
              }}
              variant="secondary"
              icon={<Sparkles color="orange" />}
              __height="50px"
              __width="50px"
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
                (responseFromApp && responseFromApp[TranslationInputFieldName.name]?.newValue) ||
                data?.translation?.name ||
                null,
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
                (responseFromApp &&
                  responseFromApp[TranslationInputFieldName.description]?.newValue) ||
                data?.translation?.description ||
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
                (responseFromApp &&
                  responseFromApp[TranslationInputFieldName.seoTitle]?.newValue) ||
                data?.translation?.seoTitle ||
                null,
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
                (responseFromApp &&
                  responseFromApp[TranslationInputFieldName.seoDescription]?.newValue) ||
                data?.translation?.seoDescription ||
                null,
              type: "long",
              value: data?.product?.seoDescription,
            },
          ]}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode}
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
              richTextResetKey={languageCode}
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

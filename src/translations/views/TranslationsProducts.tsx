import { OutputData } from "@editorjs/editorjs";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringifyQs } from "@saleor/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, maybe } from "../../misc";
import { LanguageCodeEnum } from "../../types/globalTypes";
import TranslationsProductsPage from "../components/TranslationsProductsPage";
import {
  TypedUpdateAttributeValueTranslations,
  TypedUpdateProductTranslations
} from "../mutations";
import { useProductTranslationDetails } from "../queries";
import { TranslationField, TranslationInputFieldName } from "../types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsProductsQueryParams {
  activeField: string;
}
export interface TranslationsProductsProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsProductsQueryParams;
}

const TranslationsProducts: React.FC<TranslationsProductsProps> = ({
  id,
  languageCode,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const productTranslations = useProductTranslationDetails({
    variables: { id, language: languageCode }
  });

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field
        }),
      { replace: true }
    );

  const onUpdate = (errors: unknown[]) => {
    if (errors.length === 0) {
      productTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", { replace: true });
    }
  };

  const onDiscard = () => {
    navigate("?", { replace: true });
  };

  return (
    <TypedUpdateProductTranslations
      onCompleted={data => onUpdate(data.productTranslate.errors)}
    >
      {(updateTranslations, updateTranslationsOpts) => (
        <TypedUpdateAttributeValueTranslations
          onCompleted={data => onUpdate(data.attributeValueTranslate.errors)}
        >
          {updateAttributeValueTranslations => {
            const handleSubmit = (
              { name: fieldName }: TranslationField<TranslationInputFieldName>,
              data: string
            ) =>
              extractMutationErrors(
                updateTranslations({
                  variables: {
                    id,
                    input: getParsedTranslationInputData({
                      data,
                      fieldName
                    }),
                    language: languageCode
                  }
                })
              );

            const handleAttributeValueSubmit = (
              { id }: TranslationField<TranslationInputFieldName>,
              data: OutputData
            ) =>
              extractMutationErrors(
                updateAttributeValueTranslations({
                  variables: {
                    id,
                    input: { richText: JSON.stringify(data) },
                    language: languageCode
                  }
                })
              );

            const translation = productTranslations?.data?.translation;

            return (
              <TranslationsProductsPage
                productId={id}
                activeField={params.activeField}
                disabled={
                  productTranslations.loading || updateTranslationsOpts.loading
                }
                languageCode={languageCode}
                languages={maybe(() => shop.languages, [])}
                saveButtonState={updateTranslationsOpts.status}
                onBack={() =>
                  navigate(
                    languageEntitiesUrl(languageCode, {
                      tab: TranslatableEntities.products
                    })
                  )
                }
                onEdit={onEdit}
                onDiscard={onDiscard}
                onLanguageChange={lang =>
                  navigate(
                    languageEntityUrl(lang, TranslatableEntities.products, id)
                  )
                }
                onSubmit={handleSubmit}
                onAttributeValueSubmit={handleAttributeValueSubmit}
                data={
                  translation?.__typename === "ProductTranslatableContent"
                    ? translation
                    : null
                }
              />
            );
          }}
        </TypedUpdateAttributeValueTranslations>
      )}
    </TypedUpdateProductTranslations>
  );
};
TranslationsProducts.displayName = "TranslationsProducts";
export default TranslationsProducts;

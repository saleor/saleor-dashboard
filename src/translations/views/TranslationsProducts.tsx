// @ts-strict-ignore
import {
  LanguageCodeEnum,
  useProductTranslationDetailsQuery,
  useUpdateAttributeValueTranslationsMutation,
  useUpdateProductTranslationsMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { getMultipleUrlValues, stringifyQs } from "@dashboard/utils/urls";
import { OutputData } from "@editorjs/editorjs";
import { useIntl } from "react-intl";

import { extractMutationErrors, maybe } from "../../misc";
import { TranslationsProductsPage } from "../components/TranslationsProductsPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getAttributeValueTranslationsInputData, getParsedTranslationInputData } from "../utils";

type HandleSubmitAttributeValue = OutputData | string;

export interface TranslationsProductsQueryParams {
  activeField: string;
}
interface TranslationsProductsProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsProductsQueryParams;
}

const TranslationsProducts = ({ id, languageCode, params }: TranslationsProductsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const productTranslations = useProductTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const onUpdate = (errors: unknown[]) => {
    if (errors.length === 0) {
      productTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }
  };
  const [updateTranslations, updateTranslationsOpts] = useUpdateProductTranslationsMutation({
    onCompleted: data => onUpdate(data.productTranslate.errors),
  });
  const [updateAttributeValueTranslations] = useUpdateAttributeValueTranslationsMutation({
    onCompleted: data => onUpdate(data.attributeValueTranslate.errors),
  });
  const onEdit = (field: string | string[]) =>
    navigate(
      "?" +
        stringifyQs(
          {
            activeField: field,
          },
          "repeat",
        ),
      { replace: true },
    );
  const onDiscard = (field?: string) => {
    if (!field) {
      return navigate("?", { replace: true });
    }

    const activeFields = getMultipleUrlValues(new URL(window.location.href).search, "activeField");

    navigate(
      "?" +
        stringifyQs(
          {
            activeField: activeFields.filter(f => f !== field),
          },
          "repeat",
        ),
      { replace: true },
    );
  };

  const handleSubmit = (
    { name: fieldName }: TranslationField<TranslationInputFieldName>,
    data: string,
  ) => {
    return extractMutationErrors(
      updateTranslations({
        variables: {
          id,
          input: getParsedTranslationInputData({
            data,
            fieldName,
          }),
          language: languageCode,
        },
      }),
    ).then(errors => {
      if (errors.length === 0) {
        const activeFields = getMultipleUrlValues(
          new URL(window.location.href).search,
          "activeField",
        );

        const newActiveFields = activeFields.filter(f => f !== fieldName);

        navigate(
          "?" +
            stringifyQs(
              {
                activeField: newActiveFields,
              },
              "repeat",
            ),
          { replace: true },
        );
      }

      return errors;
    });
  };
  const handleAttributeValueSubmit = (
    { id, type }: TranslationField<TranslationInputFieldName>,
    data: HandleSubmitAttributeValue,
  ) =>
    extractMutationErrors(
      updateAttributeValueTranslations({
        variables: {
          id,
          input: getAttributeValueTranslationsInputData(type, data),
          language: languageCode,
        },
      }),
    );
  const translation = productTranslations?.data?.translation;

  return (
    <TranslationsProductsPage
      translationId={id}
      productId={id}
      activeField={params.activeField}
      disabled={productTranslations.loading || updateTranslationsOpts.loading}
      languageCode={languageCode}
      languages={maybe(() => shop.languages, [])}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      onAttributeValueSubmit={handleAttributeValueSubmit}
      data={translation?.__typename === "ProductTranslatableContent" ? translation : null}
    />
  );
};

TranslationsProducts.displayName = "TranslationsProducts";
export default TranslationsProducts;

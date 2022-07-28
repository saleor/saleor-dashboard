import {
  LanguageCodeEnum,
  useCollectionTranslationDetailsQuery,
  useUpdateCollectionTranslationsMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringifyQs } from "@saleor/utils/urls";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, maybe } from "../../misc";
import TranslationsCollectionsPage from "../components/TranslationsCollectionsPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsCollectionsQueryParams {
  activeField: string;
}
export interface TranslationsCollectionsProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsCollectionsQueryParams;
}

const TranslationsCollections: React.FC<TranslationsCollectionsProps> = ({
  id,
  languageCode,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const collectionTranslations = useCollectionTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });

  const [
    updateTranslations,
    updateTranslationsOpts,
  ] = useUpdateCollectionTranslationsMutation({
    onCompleted: data => {
      if (data.collectionTranslate.errors.length === 0) {
        collectionTranslations.refetch();
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate("?", { replace: true });
      }
    },
  });

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field,
        }),
      { replace: true },
    );

  const onDiscard = () => {
    navigate("?", { replace: true });
  };
  const translation = collectionTranslations?.data?.translation;

  const handleSubmit = (
    { name: fieldName }: TranslationField<TranslationInputFieldName>,
    data: string,
  ) =>
    extractMutationErrors(
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
    );

  return (
    <TranslationsCollectionsPage
      translationId={id}
      activeField={params.activeField}
      disabled={
        collectionTranslations.loading || updateTranslationsOpts.loading
      }
      languageCode={languageCode}
      languages={maybe(() => shop.languages, [])}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      data={
        translation?.__typename === "CollectionTranslatableContent"
          ? translation
          : null
      }
    />
  );
};
TranslationsCollections.displayName = "TranslationsCollections";
export default TranslationsCollections;

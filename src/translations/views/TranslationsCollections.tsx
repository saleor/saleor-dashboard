import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../misc";
import { LanguageCodeEnum } from "../../types/globalTypes";
import TranslationsCollectionsPage from "../components/TranslationsCollectionsPage";
import { TypedUpdateCollectionTranslations } from "../mutations";
import { useCollectionTranslationDetails } from "../queries";
import { TranslationInputFieldName } from "../types";
import { UpdateCollectionTranslations } from "../types/UpdateCollectionTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";
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
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const collectionTranslations = useCollectionTranslationDetails({
    variables: { id, language: languageCode }
  });

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field
        }),
      true
    );
  const onUpdate = (data: UpdateCollectionTranslations) => {
    if (data.collectionTranslate.errors.length === 0) {
      collectionTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", true);
    }
  };
  const onDiscard = () => {
    navigate("?", true);
  };
  const translation = collectionTranslations?.data?.translation;

  return (
    <TypedUpdateCollectionTranslations onCompleted={onUpdate}>
      {(updateTranslations, updateTranslationsOpts) => {
        const handleSubmit = (
          fieldName: TranslationInputFieldName,
          data: string
        ) => {
          updateTranslations({
            variables: {
              id,
              input: getParsedTranslationInputData({ data, fieldName }),
              language: languageCode
            }
          });
        };

        return (
          <TranslationsCollectionsPage
            activeField={params.activeField}
            disabled={
              collectionTranslations.loading || updateTranslationsOpts.loading
            }
            languageCode={languageCode}
            languages={maybe(() => shop.languages, [])}
            saveButtonState={updateTranslationsOpts.status}
            onEdit={onEdit}
            onDiscard={onDiscard}
            onBack={() =>
              navigate(
                languageEntitiesUrl(languageCode, {
                  tab: TranslatableEntities.collections
                })
              )
            }
            onLanguageChange={lang =>
              navigate(
                languageEntityUrl(lang, TranslatableEntities.collections, id)
              )
            }
            onSubmit={handleSubmit}
            data={
              translation?.__typename === "CollectionTranslatableContent"
                ? translation
                : null
            }
          />
        );
      }}
    </TypedUpdateCollectionTranslations>
  );
};
TranslationsCollections.displayName = "TranslationsCollections";
export default TranslationsCollections;

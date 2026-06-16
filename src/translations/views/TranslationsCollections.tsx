import {
  type CollectionTranslationFragment,
  type LanguageCodeEnum,
  useCollectionTranslationDetailsQuery,
  useUpdateCollectionTranslationsMutation,
} from "@dashboard/graphql";

import { TranslationsCollectionsPage } from "../components/TranslationsCollectionsPage/TranslationsCollectionsPage";
import { useTranslationEntityView } from "../hooks/useTranslationEntityView";
import { type TranslationDetailQueryParams } from "../translationQueryParams";

export interface TranslationsCollectionsQueryParams extends TranslationDetailQueryParams {}

interface TranslationsCollectionsProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsCollectionsQueryParams;
}

const TranslationsCollections = ({ id, languageCode, params }: TranslationsCollectionsProps) => {
  const collectionTranslations = useCollectionTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const entityMutation = useUpdateCollectionTranslationsMutation();
  const viewProps = useTranslationEntityView<CollectionTranslationFragment>({
    id,
    languageCode,
    params,
    translatableContentTypename: "CollectionTranslatableContent",
    detailsQuery: collectionTranslations,
    entityMutation,
  });

  return <TranslationsCollectionsPage translationId={id} {...viewProps} />;
};

TranslationsCollections.displayName = "TranslationsCollections";
export { TranslationsCollections };

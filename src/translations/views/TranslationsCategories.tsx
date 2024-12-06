// @ts-strict-ignore
import {
  LanguageCodeEnum,
  useCategoryTranslationDetailsQuery,
  useUpdateCategoryTranslationsMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { stringifyQs } from "@dashboard/utils/urls";
import { OutputData } from "@editorjs/editorjs";
import { useIntl } from "react-intl";

import TranslationsCategoriesPage from "../components/TranslationsCategoriesPage";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getParsedTranslationInputData } from "../utils";

type HandleSubmitData = string | OutputData;

export interface TranslationsCategoriesQueryParams {
  activeField: string;
}
export interface TranslationsCategoriesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsCategoriesQueryParams;
}

const TranslationsCategories = ({ id, languageCode, params }: TranslationsCategoriesProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const categoryTranslations = useCategoryTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const [updateTranslations, updateTranslationsOpts] = useUpdateCategoryTranslationsMutation({
    onCompleted: data => {
      if (data.categoryTranslate.errors.length === 0) {
        categoryTranslations.refetch();
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
  const handleSubmit = (
    { name: fieldName }: TranslationField<TranslationInputFieldName>,
    data: HandleSubmitData,
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
  const translation = categoryTranslations?.data?.translation;

  return (
    <TranslationsCategoriesPage
      translationId={id}
      activeField={params.activeField}
      disabled={categoryTranslations.loading || updateTranslationsOpts.loading}
      languageCode={languageCode}
      languages={shop?.languages || []}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      data={translation?.__typename === "CategoryTranslatableContent" ? translation : null}
    />
  );
};

TranslationsCategories.displayName = "TranslationsCategories";
export default TranslationsCategories;

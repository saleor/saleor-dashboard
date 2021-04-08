import { OutputData } from "@editorjs/editorjs";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationState, maybe } from "../../misc";
import { LanguageCodeEnum } from "../../types/globalTypes";
import TranslationsProductTypesPage, {
  fieldNames
} from "../components/TranslationsProductTypesPage";
import {
  TypedUpdateAttributeTranslations,
  TypedUpdateAttributeValueTranslations
} from "../mutations";
import { useAttributeTranslationDetails } from "../queries";
import { UpdateAttributeTranslations } from "../types/UpdateAttributeTranslations";
import { UpdateAttributeValueTranslations } from "../types/UpdateAttributeValueTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";

export interface TranslationsProductTypesQueryParams {
  activeField: string;
}
export interface TranslationsProductTypesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsProductTypesQueryParams;
}

const TranslationsProductTypes: React.FC<TranslationsProductTypesProps> = ({
  id,
  languageCode,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const attributeTranslations = useAttributeTranslationDetails({
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
  const onAttributeUpdate = (data: UpdateAttributeTranslations) => {
    if (data.attributeTranslate.errors.length === 0) {
      attributeTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", true);
    }
  };
  const onAttributeValueUpdate = (data: UpdateAttributeValueTranslations) => {
    if (data.attributeValueTranslate.errors.length === 0) {
      attributeTranslations.refetch();
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

  return (
    <TypedUpdateAttributeTranslations onCompleted={onAttributeUpdate}>
      {(updateAttributeTranslations, updateAttributeTranslationsOpts) => (
        <TypedUpdateAttributeValueTranslations
          onCompleted={onAttributeValueUpdate}
        >
          {(
            updateAttributeValueTranslations,
            updateAttributeValueTranslationsOpts
          ) => {
            const handleSubmit = (field: string, data: string | OutputData) => {
              const [fieldName, fieldId] = field.split(":");

              if (fieldName === fieldNames.attribute) {
                updateAttributeTranslations({
                  variables: {
                    id: fieldId,
                    input: { name: data as string },
                    language: languageCode
                  }
                });
              } else if (
                [fieldNames.value, fieldNames.richTextValue].includes(fieldName)
              ) {
                const isRichText = fieldName === fieldNames.richTextValue;
                updateAttributeValueTranslations({
                  variables: {
                    id: fieldId,
                    input: isRichText
                      ? { richText: JSON.stringify(data) }
                      : { name: data as string },
                    language: languageCode
                  }
                });
              }
            };

            const saveButtonState = getMutationState(
              updateAttributeTranslationsOpts.called ||
                updateAttributeValueTranslationsOpts.called,
              updateAttributeTranslationsOpts.loading ||
                updateAttributeValueTranslationsOpts.loading,
              maybe(
                () =>
                  updateAttributeTranslationsOpts.data.attributeTranslate
                    .errors,
                []
              ),
              maybe(
                () =>
                  updateAttributeValueTranslationsOpts.data
                    .attributeValueTranslate.errors,
                []
              )
            );
            const translation = attributeTranslations?.data?.translation;

            return (
              <TranslationsProductTypesPage
                activeField={params.activeField}
                disabled={
                  attributeTranslations.loading ||
                  updateAttributeTranslationsOpts.loading ||
                  updateAttributeValueTranslationsOpts.loading
                }
                languageCode={languageCode}
                languages={maybe(() => shop.languages, [])}
                saveButtonState={saveButtonState}
                onBack={() =>
                  navigate(
                    languageEntitiesUrl(languageCode, {
                      tab: TranslatableEntities.productTypes
                    })
                  )
                }
                onEdit={onEdit}
                onDiscard={onDiscard}
                onLanguageChange={lang =>
                  navigate(
                    languageEntityUrl(
                      lang,
                      TranslatableEntities.productTypes,
                      id
                    )
                  )
                }
                onSubmit={handleSubmit}
                data={
                  translation?.__typename === "AttributeTranslatableContent"
                    ? translation
                    : null
                }
              />
            );
          }}
        </TypedUpdateAttributeValueTranslations>
      )}
    </TypedUpdateAttributeTranslations>
  );
};
TranslationsProductTypes.displayName = "TranslationsProductTypes";
export default TranslationsProductTypes;

import { Backlink } from "@dashboard/components/Backlink";
import LanguageSwitch from "@dashboard/components/LanguageSwitch";
import PageHeader from "@dashboard/components/PageHeader";
import { LanguageCodeEnum, SaleTranslationFragment } from "@dashboard/graphql";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsEntitiesPageProps } from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import React from "react";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

export interface TranslationsSalesPageProps
  extends TranslationsEntitiesPageProps {
  data: SaleTranslationFragment;
}

export const fieldNames = {
  name: "name",
};

const TranslationsSalesPage: React.FC<TranslationsSalesPageProps> = ({
  translationId,
  activeField,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  onDiscard,
  onEdit,
  onSubmit,
}) => {
  const intl = useIntl();

  return (
    <>
      <Backlink
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.sales,
        })}
      >
        {intl.formatMessage(sectionNames.translations)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            id: "zjkAMs",
            defaultMessage: 'Translation Sale "{saleName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            saleName: getStringOrPlaceholder(data?.sale?.name),
          },
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(lang, TranslatableEntities.sales, translationId)
          }
        />
      </PageHeader>
      <TranslationFields
        activeField={activeField}
        disabled={disabled}
        initialState={true}
        title={intl.formatMessage(commonMessages.generalInformations)}
        fields={[
          {
            displayName: intl.formatMessage({
              id: "s40PZt",
              defaultMessage: "Sale Name",
            }),
            name: fieldNames.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.sale?.name,
          },
        ]}
        saveButtonState={saveButtonState}
        richTextResetKey={languageCode}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
    </>
  );
};
TranslationsSalesPage.displayName = "TranslationsSalesPage";
export default TranslationsSalesPage;

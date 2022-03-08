import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { LanguageCodeEnum, SaleTranslationFragment } from "@saleor/graphql";
import { commonMessages, sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import { TranslationsEntitiesPageProps } from "@saleor/translations/types";
import React from "react";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

export interface TranslationsSalesPageProps
  extends TranslationsEntitiesPageProps {
  data: SaleTranslationFragment;
}

export const fieldNames = {
  name: "name"
};

const TranslationsSalesPage: React.FC<TranslationsSalesPageProps> = ({
  activeField,
  disabled,
  languageCode,
  languages,
  data,
  saveButtonState,
  onBack,
  onDiscard,
  onEdit,
  onLanguageChange,
  onSubmit
}) => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.translations)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            defaultMessage: 'Translation Sale "{saleName}" - {languageCode}',
            description: "header"
          },
          {
            languageCode,
            saleName: getStringOrPlaceholder(data?.sale?.name)
          }
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={onLanguageChange}
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
              defaultMessage: "Sale Name"
            }),
            name: fieldNames.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.sale?.name
          }
        ]}
        saveButtonState={saveButtonState}
        richTextResetKey={languageCode}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
    </Container>
  );
};
TranslationsSalesPage.displayName = "TranslationsSalesPage";
export default TranslationsSalesPage;

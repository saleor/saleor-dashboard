import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { LanguageCodeEnum, VoucherTranslationFragment } from "@saleor/graphql";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import { TranslationsEntitiesPageProps } from "@saleor/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@saleor/translations/urls";
import React from "react";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

export interface TranslationsVouchersPageProps
  extends TranslationsEntitiesPageProps {
  data: VoucherTranslationFragment;
}

export const fieldNames = {
  name: "name",
};

const TranslationsVouchersPage: React.FC<TranslationsVouchersPageProps> = ({
  translationId,
  activeField,
  disabled,
  languages,
  languageCode,
  data,
  saveButtonState,
  onDiscard,
  onEdit,
  onSubmit,
}) => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.vouchers,
        })}
      >
        {intl.formatMessage(sectionNames.translations)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            id: "1tXSSK",
            defaultMessage:
              'Translation Voucher "{voucherName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            voucherName: getStringOrPlaceholder(data?.voucher?.name),
          },
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(
              lang,
              TranslatableEntities.vouchers,
              translationId,
            )
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
              id: "sfErC+",
              defaultMessage: "Voucher Name",
            }),
            name: fieldNames.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.voucher?.name,
          },
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
TranslationsVouchersPage.displayName = "TranslationsVouchersPage";
export default TranslationsVouchersPage;

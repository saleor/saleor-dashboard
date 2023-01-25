import { Backlink } from "@dashboard/components/Backlink";
import LanguageSwitch from "@dashboard/components/LanguageSwitch";
import PageHeader from "@dashboard/components/PageHeader";
import {
  LanguageCodeEnum,
  VoucherTranslationFragment,
} from "@dashboard/graphql";
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
    <>
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
    </>
  );
};
TranslationsVouchersPage.displayName = "TranslationsVouchersPage";
export default TranslationsVouchersPage;

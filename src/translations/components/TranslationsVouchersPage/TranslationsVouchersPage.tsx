// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import LanguageSwitch from "@dashboard/components/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { LanguageCodeEnum, VoucherTranslationFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
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

export interface TranslationsVouchersPageProps extends TranslationsEntitiesPageProps {
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
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.vouchers,
        })}
        title={intl.formatMessage(
          {
            id: "1tXSSK",
            defaultMessage: 'Translation Voucher "{voucherName}" - {languageCode}',
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
            languageEntityUrl(lang, TranslatableEntities.vouchers, translationId)
          }
        />
      </TopNav>
      <DetailPageLayout.Content>
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
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
TranslationsVouchersPage.displayName = "TranslationsVouchersPage";
export default TranslationsVouchersPage;

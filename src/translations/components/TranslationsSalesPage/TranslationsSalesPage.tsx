// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { LanguageCodeEnum, SaleTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsEntitiesPageProps } from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

interface TranslationsSalesPageProps extends TranslationsEntitiesPageProps {
  data: SaleTranslationFragment;
}

const fieldNames = {
  name: "name",
};

const TranslationsSalesPage = ({
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
}: TranslationsSalesPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.sales,
        })}
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
        <LanguageSwitchWithCaching
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={lang =>
            navigate(languageEntityUrl(lang, TranslatableEntities.sales, translationId))
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
                id: "s40PZt",
                defaultMessage: "Sale Name",
              }),
              name: fieldNames.name,
              translation: data?.translation?.name || null,
              type: "short" as const,
              value: data?.sale?.name,
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

TranslationsSalesPage.displayName = "TranslationsSalesPage";
export default TranslationsSalesPage;

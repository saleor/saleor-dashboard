// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { LanguageCodeEnum, ShippingMethodTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps,
} from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

interface TranslationsShippingMethodPageProps extends TranslationsEntitiesPageProps {
  data: ShippingMethodTranslationFragment;
}

const TranslationsShippingMethodPage = ({
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
}: TranslationsShippingMethodPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.shippingMethods,
        })}
        title={intl.formatMessage(
          {
            id: "1UKx20",
            defaultMessage: 'Translation ShippingMethod "{shippingMethodName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            shippingMethodName: getStringOrPlaceholder(data?.name),
          },
        )}
      >
        <LanguageSwitchWithCaching
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={lang =>
            navigate(languageEntityUrl(lang, TranslatableEntities.shippingMethods, translationId))
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
                id: "aPCrsp",
                defaultMessage: "Name",
                description: "shipping method name",
              }),
              name: TranslationInputFieldName.name,
              translation: data?.translation?.name || null,
              type: "short" as const,
              value: data?.name,
            },
            {
              displayName: intl.formatMessage({
                id: "GpqEl5",
                defaultMessage: "Description",
                description: "shipping method description",
              }),
              name: TranslationInputFieldName.description,
              translation: data?.translation?.description || null,
              type: "rich",
              value: data?.description,
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

TranslationsShippingMethodPage.displayName = "TranslationsShippingMethodPage";
export default TranslationsShippingMethodPage;

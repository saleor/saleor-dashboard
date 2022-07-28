import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import {
  LanguageCodeEnum,
  ShippingMethodTranslationFragment,
} from "@saleor/graphql";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import {
  TranslationInputFieldName,
  TranslationsEntitiesPageProps,
} from "@saleor/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@saleor/translations/urls";
import React from "react";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

export interface TranslationsShippingMethodPageProps
  extends TranslationsEntitiesPageProps {
  data: ShippingMethodTranslationFragment;
}

const TranslationsShippingMethodPage: React.FC<TranslationsShippingMethodPageProps> = ({
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
    <Container>
      <Backlink
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.shippingMethods,
        })}
      >
        {intl.formatMessage(sectionNames.translations)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            id: "1UKx20",
            defaultMessage:
              'Translation ShippingMethod "{shippingMethodName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            shippingMethodName: getStringOrPlaceholder(data?.name),
          },
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(
              lang,
              TranslatableEntities.shippingMethods,
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
              id: "aPCrsp",
              defaultMessage: "Name",
              description: "shipping method name",
            }),
            name: TranslationInputFieldName.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
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
    </Container>
  );
};
TranslationsShippingMethodPage.displayName = "TranslationsShippingMethodPage";
export default TranslationsShippingMethodPage;

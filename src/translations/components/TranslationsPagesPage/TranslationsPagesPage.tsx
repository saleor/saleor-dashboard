import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import { LanguageCodeEnum, PageTranslationFragment } from "@saleor/graphql";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import {
  PageTranslationInputFieldName,
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

export interface TranslationsPagesPageProps
  extends TranslationsEntitiesPageProps {
  data: PageTranslationFragment;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsPagesPage: React.FC<TranslationsPagesPageProps> = ({
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
  onAttributeValueSubmit,
}) => {
  const intl = useIntl();

  return (
    <Container>
      <Backlink
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.pages,
        })}
      >
        {intl.formatMessage(sectionNames.translations)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            id: "oUWXLO",
            defaultMessage: 'Translation Page "{pageName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            pageName: getStringOrPlaceholder(data?.page?.title),
          },
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(lang, TranslatableEntities.pages, translationId)
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
              id: "gvOzOl",
              defaultMessage: "Page Title",
            }),
            name: PageTranslationInputFieldName.title,
            translation: data?.translation?.title || null,
            type: "short" as "short",
            value: data?.page?.title,
          },
          {
            displayName: intl.formatMessage({
              id: "gMwpNC",
              defaultMessage: "Content",
              description: "page content",
            }),
            name: PageTranslationInputFieldName.content,
            translation: data?.translation?.content || null,
            type: "rich" as "rich",
            value: data?.page?.content,
          },
        ]}
        saveButtonState={saveButtonState}
        richTextResetKey={languageCode}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />

      <CardSpacer />
      <TranslationFields
        activeField={activeField}
        disabled={disabled}
        initialState={true}
        title={intl.formatMessage({
          id: "TGX4T1",
          defaultMessage: "Search Engine Preview",
        })}
        fields={[
          {
            displayName: intl.formatMessage({
              id: "HlEpii",
              defaultMessage: "Search Engine Title",
            }),
            name: PageTranslationInputFieldName.seoTitle,
            translation: data?.translation?.seoTitle || null,
            type: "short" as "short",
            value: data?.page?.seoTitle,
          },
          {
            displayName: intl.formatMessage({
              id: "US3IPU",
              defaultMessage: "Search Engine Description",
            }),
            name: PageTranslationInputFieldName.seoDescription,
            translation: data?.translation?.seoDescription || null,
            type: "long" as "long",
            value: data?.page?.seoDescription,
          },
        ]}
        saveButtonState={saveButtonState}
        richTextResetKey={languageCode}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSubmit={onSubmit}
      />
      <CardSpacer />
      {data?.attributeValues?.length > 0 && (
        <>
          <TranslationFields
            activeField={activeField}
            disabled={disabled}
            initialState={true}
            title={intl.formatMessage(commonMessages.translationAttributes)}
            fields={
              data.attributeValues.map((attrVal, i) => ({
                id: attrVal.attributeValue.id,
                displayName: intl.formatMessage(
                  {
                    id: "PajjqE",
                    defaultMessage: "Attribute {number}",
                    description: "attribute list",
                  },
                  {
                    number: i + 1,
                  },
                ),
                name: attrVal?.name,
                translation: attrVal?.translation?.richText || null,
                type: "rich" as "rich",
                value: attrVal?.richText,
              })) || []
            }
            saveButtonState={saveButtonState}
            richTextResetKey={languageCode}
            onEdit={onEdit}
            onDiscard={onDiscard}
            onSubmit={onAttributeValueSubmit}
          />
          <CardSpacer />
        </>
      )}
    </Container>
  );
};
TranslationsPagesPage.displayName = "TranslationsPagesPage";
export default TranslationsPagesPage;

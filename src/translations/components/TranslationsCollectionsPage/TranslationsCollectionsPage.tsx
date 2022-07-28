import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import LanguageSwitch from "@saleor/components/LanguageSwitch";
import PageHeader from "@saleor/components/PageHeader";
import {
  CollectionTranslationFragment,
  LanguageCodeEnum,
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

export interface TranslationsCollectionsPageProps
  extends TranslationsEntitiesPageProps {
  data: CollectionTranslationFragment;
}

const TranslationsCollectionsPage: React.FC<TranslationsCollectionsPageProps> = ({
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
          tab: TranslatableEntities.collections,
        })}
      >
        {intl.formatMessage(sectionNames.translations)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            id: "Bphmwe",
            defaultMessage:
              'Translation Collection "{collectionName}" - {languageCode}',
            description: "header",
          },
          {
            collectionName: getStringOrPlaceholder(data?.collection?.name),
            languageCode,
          },
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(
              lang,
              TranslatableEntities.collections,
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
              id: "VZsE96",
              defaultMessage: "Collection Name",
            }),
            name: TranslationInputFieldName.name,
            translation: data?.translation?.name || null,
            type: "short" as "short",
            value: data?.collection?.name,
          },
          {
            displayName: intl.formatMessage(commonMessages.description),
            name: TranslationInputFieldName.description,
            translation: data?.translation?.description || null,
            type: "rich" as "rich",
            value: data?.collection?.description,
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
            name: TranslationInputFieldName.seoTitle,
            translation: data?.translation?.seoTitle || null,
            type: "short" as "short",
            value: data?.collection?.seoTitle,
          },
          {
            displayName: intl.formatMessage({
              id: "US3IPU",
              defaultMessage: "Search Engine Description",
            }),
            name: TranslationInputFieldName.seoDescription,
            translation: data?.translation?.seoDescription || null,
            type: "long" as "long",
            value: data?.collection?.seoDescription,
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
TranslationsCollectionsPage.displayName = "TranslationsCollectionsPage";
export default TranslationsCollectionsPage;

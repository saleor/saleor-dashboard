// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { CollectionTranslationFragment, LanguageCodeEnum } from "@dashboard/graphql";
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

interface TranslationsCollectionsPageProps extends TranslationsEntitiesPageProps {
  data: CollectionTranslationFragment;
}

const TranslationsCollectionsPage = ({
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
}: TranslationsCollectionsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.collections,
        })}
        title={intl.formatMessage(
          {
            id: "Bphmwe",
            defaultMessage: 'Translation Collection "{collectionName}" - {languageCode}',
            description: "header",
          },
          {
            collectionName: getStringOrPlaceholder(data?.collection?.name),
            languageCode,
          },
        )}
      >
        <LanguageSwitchWithCaching
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={lang =>
            navigate(languageEntityUrl(lang, TranslatableEntities.collections, translationId))
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
                id: "VZsE96",
                defaultMessage: "Collection Name",
              }),
              name: TranslationInputFieldName.name,
              translation: data?.translation?.name || null,
              type: "short" as const,
              value: data?.collection?.name,
            },
            {
              displayName: intl.formatMessage(commonMessages.description),
              name: TranslationInputFieldName.description,
              translation: data?.translation?.description || null,
              type: "rich" as const,
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
              type: "short" as const,
              value: data?.collection?.seoTitle,
            },
            {
              displayName: intl.formatMessage({
                id: "US3IPU",
                defaultMessage: "Search Engine Description",
              }),
              name: TranslationInputFieldName.seoDescription,
              translation: data?.translation?.seoDescription || null,
              type: "long" as const,
              value: data?.collection?.seoDescription,
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

TranslationsCollectionsPage.displayName = "TranslationsCollectionsPage";
export default TranslationsCollectionsPage;

// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { LanguageCodeEnum, PageTranslationFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import {
  PageTranslationInputFieldName,
  TranslationsEntitiesPageProps,
} from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { mapAttributeValuesToTranslationFields } from "@dashboard/translations/utils";
import { useIntl } from "react-intl";

import TranslationFields from "../TranslationFields";

interface TranslationsPagesPageProps extends TranslationsEntitiesPageProps {
  data: PageTranslationFragment;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsPagesPage = ({
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
}: TranslationsPagesPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.pages,
        })}
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
        <LanguageSwitchWithCaching
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          onLanguageChange={lang =>
            navigate(languageEntityUrl(lang, TranslatableEntities.pages, translationId))
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
                id: "DaPGcn",
                defaultMessage: "Model title",
              }),
              name: PageTranslationInputFieldName.title,
              translation: data?.translation?.title || null,
              type: "short",
              value: data?.page?.title,
            },
            {
              displayName: intl.formatMessage({
                id: "ymvZrH",
                defaultMessage: "Models",
                description: "page models",
              }),
              name: PageTranslationInputFieldName.content,
              translation: data?.translation?.content || null,
              type: "rich",
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
              type: "short",
              value: data?.page?.seoTitle,
            },
            {
              displayName: intl.formatMessage({
                id: "US3IPU",
                defaultMessage: "Search Engine Description",
              }),
              name: PageTranslationInputFieldName.seoDescription,
              translation: data?.translation?.seoDescription || null,
              type: "long",
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
              fields={mapAttributeValuesToTranslationFields(data.attributeValues, intl)}
              saveButtonState={saveButtonState}
              richTextResetKey={languageCode}
              onEdit={onEdit}
              onDiscard={onDiscard}
              onSubmit={onAttributeValueSubmit}
            />
            <CardSpacer />
          </>
        )}
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsPagesPage.displayName = "TranslationsPagesPage";
export default TranslationsPagesPage;

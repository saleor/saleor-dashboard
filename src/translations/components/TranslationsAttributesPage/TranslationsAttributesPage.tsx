// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import LanguageSwitch from "@dashboard/components/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { ListSettingsUpdate } from "@dashboard/components/TablePagination";
import { AttributeTranslationDetailsFragment, LanguageCodeEnum } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { TranslationsEntitiesPageProps } from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { ListSettings } from "@dashboard/types";
import { useIntl } from "react-intl";

import { getTranslationFields } from "../../utils";
import TranslationFields from "../TranslationFields";
import { transtionsAttributesPageFieldsMessages as messages } from "./messages";

export interface TranslationsAttributesPageProps extends TranslationsEntitiesPageProps {
  data: AttributeTranslationDetailsFragment;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
}

export const fieldNames = {
  attribute: "attribute",
  value: "attributeValue",
  richTextValue: "attributeRichTextValue",
};

const TranslationsAttributesPage = ({
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
  settings,
  onUpdateListSettings,
}: TranslationsAttributesPageProps) => {
  const intl = useIntl();
  const withChoices = data?.attribute?.withChoices;

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.attributes,
        })}
        title={intl.formatMessage(
          {
            id: "SPBLzT",
            defaultMessage: 'Translation Attribute "{attribute}" - {languageCode}',
            description: "header",
          },
          {
            attribute: getStringOrPlaceholder(data?.attribute?.name),
            languageCode,
          },
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(lang, TranslatableEntities.attributes, translationId)
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
                id: "DRMMDs",
                defaultMessage: "Attribute Name",
              }),
              name: fieldNames.attribute + ":" + data?.attribute.id,
              translation: data?.translation?.name || null,
              type: "short" as const,
              value: data?.attribute?.name,
            },
          ]}
          saveButtonState={saveButtonState}
          richTextResetKey={languageCode}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onSubmit={onSubmit}
        />
        <CardSpacer />
        {data?.attribute?.choices.edges.length > 0 && withChoices && (
          <TranslationFields
            activeField={activeField}
            disabled={disabled}
            initialState={true}
            title={intl.formatMessage(messages.values)}
            fields={getTranslationFields(data?.attribute?.choices, intl)}
            saveButtonState={saveButtonState}
            richTextResetKey={languageCode}
            pagination={{
              settings,
              onUpdateListSettings,
            }}
            onEdit={onEdit}
            onDiscard={onDiscard}
            onSubmit={onSubmit}
          />
        )}
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

TranslationsAttributesPage.displayName = "TranslationsAttributesPage";
export default TranslationsAttributesPage;

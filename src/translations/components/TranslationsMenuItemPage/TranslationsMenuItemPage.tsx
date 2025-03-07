// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import LanguageSwitch from "@dashboard/components/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { LanguageCodeEnum, MenuItemTranslationFragment } from "@dashboard/graphql";
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

export interface TranslationsMenuItemPageProps extends TranslationsEntitiesPageProps {
  data: MenuItemTranslationFragment;
}

const TranslationsMenuItemPage = ({
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
}: TranslationsMenuItemPageProps) => {
  const intl = useIntl();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.menuItems,
        })}
        title={intl.formatMessage(
          {
            id: "IOshTA",
            defaultMessage: 'Translation MenuItem "{menuItemName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            menuItemName: getStringOrPlaceholder(data?.menuItem.name),
          },
        )}
      >
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(lang, TranslatableEntities.menuItems, translationId)
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
                id: "0Vyr8h",
                defaultMessage: "Name",
                description: "menu item name",
              }),
              name: TranslationInputFieldName.name,
              translation: data?.translation?.name || null,
              type: "short" as const,
              value: data?.menuItem.name,
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

TranslationsMenuItemPage.displayName = "TranslationsMenuItemPage";
export default TranslationsMenuItemPage;

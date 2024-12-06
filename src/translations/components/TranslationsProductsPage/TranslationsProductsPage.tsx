// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import LanguageSwitch from "@dashboard/components/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { LanguageCodeEnum, ProductTranslationFragment } from "@dashboard/graphql";
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
import { mapAttributeValuesToTranslationFields } from "@dashboard/translations/utils";
import { useIntl } from "react-intl";

import ProductContextSwitcher from "../ProductContextSwitcher";
import TranslationFields from "../TranslationFields";

export interface TranslationsProductsPageProps extends TranslationsEntitiesPageProps {
  data: ProductTranslationFragment;
  productId: string;
  onAttributeValueSubmit: TranslationsEntitiesPageProps["onSubmit"];
}

const TranslationsProductsPage = ({
  translationId,
  productId,
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
}: TranslationsProductsPageProps) => {
  const intl = useIntl();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.products,
        })}
        title={intl.formatMessage(
          {
            id: "22x9tu",
            defaultMessage: 'Translation Product "{productName}" - {languageCode}',
            description: "header",
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(data?.product?.name),
          },
        )}
      >
        <ProductContextSwitcher
          languageCode={languageCode}
          productId={productId}
          selectedId={productId}
        />
        <LanguageSwitch
          currentLanguage={LanguageCodeEnum[languageCode]}
          languages={languages}
          getLanguageUrl={lang =>
            languageEntityUrl(lang, TranslatableEntities.products, translationId)
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
                id: "ZIc5lM",
                defaultMessage: "Product Name",
              }),
              name: TranslationInputFieldName.name,
              translation: data?.translation?.name || null,
              type: "short",
              value: data?.product?.name,
            },
            {
              displayName: intl.formatMessage({
                id: "Q8Qw5B",
                defaultMessage: "Description",
              }),
              name: TranslationInputFieldName.description,
              translation: data?.translation?.description || null,
              type: "rich",
              value: data?.product?.description,
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
              type: "short",
              value: data?.product?.seoTitle,
            },
            {
              displayName: intl.formatMessage({
                id: "US3IPU",
                defaultMessage: "Search Engine Description",
              }),
              name: TranslationInputFieldName.seoDescription,
              translation: data?.translation?.seoDescription || null,
              type: "long",
              value: data?.product?.seoDescription,
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

TranslationsProductsPage.displayName = "TranslationsProductsPage";
export default TranslationsProductsPage;

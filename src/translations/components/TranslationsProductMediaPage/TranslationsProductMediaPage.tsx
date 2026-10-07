import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { LanguageSwitchWithCaching } from "@dashboard/components/LanguageSwitch/LanguageSwitch";
import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import { MediaWithFallback } from "@dashboard/components/MediaWithFallback/MediaWithFallback";
import {
  LanguageCodeEnum,
  type ProductMediaTranslationFragment,
  ProductMediaType,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { parseOembedData } from "@dashboard/products/utils/parseOembedData";
import { TranslationsDetailLayout } from "@dashboard/translations/components/TranslationsDetailLayout/TranslationsDetailLayout";
import { createProductMediaAltSection } from "@dashboard/translations/translationSectionBuilders";
import { type TranslationsEntitiesPageProps } from "@dashboard/translations/types";
import {
  languageEntitiesUrl,
  productMediaUrl,
  productUrl,
  productVariantUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { ProductContextSwitcher } from "../ProductContextSwitcher/ProductContextSwitcher";
import styles from "./TranslationsProductMediaPage.module.css";

interface ProductMediaPreviewData {
  id: string;
  alt: string;
  url: string;
  type: ProductMediaType;
  oembedData: string;
}

interface ProductMediaTranslationPreviewProps {
  alt: string;
  media?: ProductMediaPreviewData | null;
}

export const ProductMediaTranslationPreview = ({
  alt,
  media,
}: ProductMediaTranslationPreviewProps): JSX.Element => {
  if (!media) {
    return <Skeleton __width="100%" __height="100%" />;
  }

  if (media.type === ProductMediaType.IMAGE) {
    return <MediaWithFallback className={styles.previewMedia} src={media.url} alt={alt} />;
  }

  const oembedData = parseOembedData(media.oembedData);

  if (oembedData.thumbnail_url) {
    return (
      <MediaWithFallback className={styles.previewMedia} src={oembedData.thumbnail_url} alt={alt} />
    );
  }

  return (
    <div
      className={styles.previewVideo}
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: oembedData.html ?? "" }}
    />
  );
};

interface TranslationsProductMediaPageProps extends TranslationsEntitiesPageProps {
  data: ProductMediaTranslationFragment | null;
  languageCode: LanguageCodeEnum;
  media?: ProductMediaPreviewData | null;
  mediaId: string;
  productId: string;
  productName?: string | null;
}

export const TranslationsProductMediaPage = ({
  translationId,
  activeField,
  bulk,
  disabled,
  languageCode,
  languages,
  data,
  media,
  mediaId,
  productId,
  productName,
  saveButtonState,
  fieldErrors,
  onBulkChange,
  onBulkSubmit,
  onClearFieldError,
  onClearFieldErrors,
  onDiscard,
  onEdit,
  onSubmit,
}: TranslationsProductMediaPageProps): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();
  const sections = useMemo(
    () => [
      createProductMediaAltSection(intl, {
        alt: data?.alt,
        translationAlt: data?.translation?.alt,
      }),
    ],
    [data, intl],
  );
  const previewAlt = data?.translation?.alt ?? data?.alt ?? media?.alt ?? "";

  return (
    <DetailPageLayout gridTemplateColumns={12} withSavebar={bulk}>
      <TopNav
        href={languageEntitiesUrl(languageCode, {
          tab: TranslatableEntities.products,
        })}
        hrefIcon={<TopNavDestinationIcon.translations />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.translations)}
        title={intl.formatMessage(
          {
            id: "pFLrDo",
            defaultMessage: 'Translation Product Media "{productName}" - {languageCode}',
            description: "product media translation page header",
          },
          {
            languageCode,
            productName: getStringOrPlaceholder(productName),
          },
        )}
      >
        <Box display="flex" gap={3}>
          <ProductContextSwitcher
            productId={productId}
            selectedId={mediaId}
            selectedMedia={data ? { id: mediaId, alt: data.alt } : null}
            onItemChange={(id, type) => {
              if (type === "main") {
                navigate(productUrl(languageCode, productId));
              } else if (type === "variant") {
                navigate(productVariantUrl(languageCode, productId, id));
              } else {
                navigate(productMediaUrl(languageCode, productId, id));
              }
            }}
          />
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum[languageCode]}
            languages={languages}
            onLanguageChange={lang => {
              navigate(productMediaUrl(lang, productId, translationId));
            }}
          />
        </Box>
      </TopNav>
      <DetailPageLayout.Content>
        <TranslationsDetailLayout
          sections={sections}
          activeField={activeField}
          bulk={bulk}
          disabled={disabled}
          languageCode={languageCode}
          languages={languages}
          saveButtonState={saveButtonState}
          fieldErrors={fieldErrors}
          onBulkChange={onBulkChange}
          onBulkSubmit={onBulkSubmit}
          onClearFieldError={onClearFieldError}
          onClearFieldErrors={onClearFieldErrors}
          onDiscard={onDiscard}
          onEdit={onEdit}
          onSubmit={onSubmit}
        />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar padding={6}>
        <DashboardCard>
          <DashboardCard.Header>
            <DashboardCard.Title>
              {intl.formatMessage({
                id: "cW1RIo",
                defaultMessage: "Media View",
                description: "section header",
              })}
            </DashboardCard.Title>
          </DashboardCard.Header>
          <DashboardCard.Content>
            <div className={styles.previewStage} data-test-id="product-media-translation-preview">
              <ProductMediaTranslationPreview media={media} alt={previewAlt} />
            </div>
          </DashboardCard.Content>
        </DashboardCard>
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};

TranslationsProductMediaPage.displayName = "TranslationsProductMediaPage";

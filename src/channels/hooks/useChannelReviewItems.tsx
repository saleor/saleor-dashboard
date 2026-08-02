import { type CatalogProductThumbnail } from "@dashboard/channels/components/ChannelCatalogSection/CatalogProductThumbnailStack";
import {
  type ChannelSectionId,
  channelSectionIds,
} from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import { useChannelSectionScroll } from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionScrollContext";
import { getTaxStatusMessage } from "@dashboard/channels/components/ChannelSetupCard/getTaxStatusMessage";
import { messages } from "@dashboard/channels/components/ChannelSetupCard/messages";
import { getCatalogWarehouseReadiness } from "@dashboard/channels/utils/catalogWarehouseReadiness";
import { formatCatalogCount } from "@dashboard/channels/utils/formatCatalogCount";
import { productListUrlForAllProducts } from "@dashboard/channels/utils/productListCatalogUrls";
import { type SetupChecklistReviewItem } from "@dashboard/components/SetupChecklist/types";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { type TaxCalculationStrategy } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ProductsIcon } from "@dashboard/icons/Products";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { CreditCard, Receipt } from "lucide-react";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface UseChannelReviewItemsArgs {
  taxConfigurationId?: string | null;
  chargeTaxes?: boolean | null;
  taxCalculationStrategy?: TaxCalculationStrategy | null;
  channel?: {
    id: string;
    name: string;
    slug: string;
    currencyCode: string;
  };
  channelSlug?: string;
  paymentAppsCount?: number;
  publishedProductCount?: number;
  unpublishedProductCount?: number;
  listedInChannelCount?: number;
  totalProductCount?: number;
  recentlyPublishedProducts?: CatalogProductThumbnail[];
  channelWarehouseCount?: number;
  shopWarehouseCount?: number;
  canViewCatalogStats?: boolean;
  catalogStatsError?: boolean;
  catalogStatsLoading?: boolean;
  onBulkPublishCatalog?: () => void;
  /** Sections the setup checklist may scroll to on this page. */
  scrollableSectionIds?: ChannelSectionId[];
  /** Setup checklist scrolls to channel sections; panels navigate directly. */
  interaction?: "scroll" | "navigate";
}

export const useChannelReviewItems = ({
  taxConfigurationId,
  chargeTaxes,
  taxCalculationStrategy,
  channel,
  paymentAppsCount,
  publishedProductCount,
  totalProductCount,
  channelWarehouseCount = 0,
  shopWarehouseCount = 0,
  scrollableSectionIds = [],
  interaction = "scroll",
}: UseChannelReviewItemsArgs): SetupChecklistReviewItem[] => {
  const intl = useIntl();
  const navigate = useNavigator();
  const sectionScroll = useChannelSectionScroll();
  const canScrollToSection = (sectionId: ChannelSectionId): boolean =>
    interaction === "scroll" && sectionScroll != null && scrollableSectionIds.includes(sectionId);
  const catalogWarehouseReadiness = getCatalogWarehouseReadiness({
    channelWarehouseCount,
    shopWarehouseCount,
  });
  const catalogDescriptionMessage =
    catalogWarehouseReadiness === "no_shop_warehouses"
      ? messages.catalogDescriptionNoShopWarehouse
      : catalogWarehouseReadiness === "no_channel_warehouses"
        ? messages.catalogDescriptionNoChannelWarehouse
        : messages.catalogDescription;

  return useMemo(
    (): SetupChecklistReviewItem[] => [
      {
        id: "payments",
        icon: <CreditCard size={16} />,
        title: <FormattedMessage {...messages.paymentsTitle} />,
        description: (
          <FormattedMessage
            {...(paymentAppsCount === 0
              ? messages.paymentsDescriptionNone
              : messages.paymentsDescription)}
          />
        ),
        status:
          paymentAppsCount === undefined ? undefined : paymentAppsCount === 0 ? (
            <FormattedMessage {...messages.paymentsStatusNone} />
          ) : (
            <FormattedMessage
              {...messages.paymentsStatusCount}
              values={{ count: paymentAppsCount }}
            />
          ),
        onClick: () => {
          if (canScrollToSection(channelSectionIds.paymentGateways)) {
            sectionScroll?.selectSection(channelSectionIds.paymentGateways);

            return;
          }

          navigate(ExtensionsPaths.installedExtensions);
        },
      },
      {
        id: "catalog",
        icon: <ProductsIcon />,
        title: <FormattedMessage {...messages.catalogTitle} />,
        description: <FormattedMessage {...catalogDescriptionMessage} />,
        status:
          catalogWarehouseReadiness === "no_shop_warehouses" ? (
            <FormattedMessage {...messages.catalogStatusNoWarehouse} />
          ) : catalogWarehouseReadiness === "no_channel_warehouses" ? (
            <FormattedMessage {...messages.catalogStatusAssignWarehouse} />
          ) : publishedProductCount === undefined || totalProductCount === undefined ? undefined : (
            <FormattedMessage
              {...messages.catalogStatusPublished}
              values={{
                published: formatCatalogCount(publishedProductCount, intl.locale),
                total: formatCatalogCount(totalProductCount, intl.locale),
              }}
            />
          ),
        onClick: () => {
          if (canScrollToSection(channelSectionIds.catalog)) {
            sectionScroll?.selectSection(channelSectionIds.catalog);

            return;
          }

          navigate(productListUrlForAllProducts());
        },
      },
      {
        id: "tax",
        icon: <Receipt size={16} />,
        title: <FormattedMessage {...messages.taxTitle} />,
        description: <FormattedMessage {...messages.taxDescription} />,
        status: (
          <FormattedMessage {...getTaxStatusMessage({ chargeTaxes, taxCalculationStrategy })} />
        ),
        onClick: () => {
          if (canScrollToSection(channelSectionIds.taxes)) {
            sectionScroll?.selectSection(channelSectionIds.taxes);

            return;
          }

          navigate(taxConfigurationListUrl(taxConfigurationId ?? undefined));
        },
        disabled: !taxConfigurationId,
      },
    ],
    [
      catalogDescriptionMessage,
      catalogWarehouseReadiness,
      chargeTaxes,
      channel,
      interaction,
      intl.locale,
      navigate,
      paymentAppsCount,
      publishedProductCount,
      scrollableSectionIds,
      sectionScroll,
      taxCalculationStrategy,
      taxConfigurationId,
      totalProductCount,
    ],
  );
};

import {
  type ChannelSectionId,
  channelSectionIds,
} from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import { useChannelSectionScroll } from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionScrollContext";
import { getTaxStatusMessage } from "@dashboard/channels/components/ChannelSetupCard/getTaxStatusMessage";
import { messages } from "@dashboard/channels/components/ChannelSetupCard/messages";
import { type SetupChecklistReviewItem } from "@dashboard/components/SetupChecklist/types";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { type TaxCalculationStrategy } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ProductsIcon } from "@dashboard/icons/Products";
import { productListUrl } from "@dashboard/products/urls";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { CreditCard, Receipt } from "lucide-react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

export interface UseChannelReviewItemsArgs {
  taxConfigurationId?: string | null;
  chargeTaxes?: boolean | null;
  taxCalculationStrategy?: TaxCalculationStrategy | null;
  channelSlug?: string;
  paymentAppsCount?: number;
  publishedProductCount?: number;
  totalProductCount?: number;
  /** Sections the setup checklist may scroll to on this page. */
  scrollableSectionIds?: ChannelSectionId[];
  /** Setup checklist scrolls to channel sections; panels navigate directly. */
  interaction?: "scroll" | "navigate";
}

export const useChannelReviewItems = ({
  taxConfigurationId,
  chargeTaxes,
  taxCalculationStrategy,
  channelSlug,
  paymentAppsCount,
  publishedProductCount,
  totalProductCount,
  scrollableSectionIds = [],
  interaction = "scroll",
}: UseChannelReviewItemsArgs): SetupChecklistReviewItem[] => {
  const navigate = useNavigator();
  const sectionScroll = useChannelSectionScroll();
  const canScrollToSection = (sectionId: ChannelSectionId): boolean =>
    interaction === "scroll" && sectionScroll != null && scrollableSectionIds.includes(sectionId);

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
            sectionScroll.selectSection(channelSectionIds.paymentGateways);

            return;
          }

          navigate(ExtensionsPaths.installedExtensions);
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
            sectionScroll.selectSection(channelSectionIds.taxes);

            return;
          }

          navigate(taxConfigurationListUrl(taxConfigurationId ?? undefined));
        },
        disabled: !taxConfigurationId,
      },
      {
        id: "catalog",
        icon: <ProductsIcon />,
        title: <FormattedMessage {...messages.catalogTitle} />,
        description: <FormattedMessage {...messages.catalogDescription} />,
        status:
          publishedProductCount === undefined || totalProductCount === undefined ? undefined : (
            <FormattedMessage
              {...messages.catalogStatusPublished}
              values={{ published: publishedProductCount, total: totalProductCount }}
            />
          ),
        onClick: () => {
          if (canScrollToSection(channelSectionIds.catalog)) {
            sectionScroll.selectSection(channelSectionIds.catalog);

            return;
          }

          navigate(productListUrl(channelSlug ? { channel: channelSlug } : undefined));
        },
      },
    ],
    [
      chargeTaxes,
      channelSlug,
      interaction,
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

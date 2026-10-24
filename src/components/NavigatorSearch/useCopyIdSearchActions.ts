import { useApolloClient } from "@apollo/client";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { type AppExtensionView } from "@dashboard/extensions/domain/app-extension-manifest-views";
import {
  decodeId,
  resolveSearchActionContext,
} from "@dashboard/extensions/search-actions/resolveSearchActionContext";
import { type ContextualSearchAction } from "@dashboard/extensions/search-actions/types";
import {
  type OrderNumberFragment,
  OrderNumberFragmentDoc,
  type ProductVariantProductIdFragment,
  ProductVariantProductIdFragmentDoc,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { productVariantEditPath } from "@dashboard/products/urls";
import { defineMessages, type MessageDescriptor, useIntl } from "react-intl";
import { matchPath, useLocation } from "react-router";

const messages = defineMessages({
  thisOrder: {
    id: "EHM+g5",
    defaultMessage: "This order",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisDraftOrder: {
    id: "nrO5SA",
    defaultMessage: "This draft order",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisProduct: {
    id: "j2qMNg",
    defaultMessage: "This product",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisVariant: {
    id: "seOi5h",
    defaultMessage: "This variant",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisCustomer: {
    id: "PDlKOb",
    defaultMessage: "This customer",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisCollection: {
    id: "1JTtUi",
    defaultMessage: "This collection",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisCategory: {
    id: "ed63Qc",
    defaultMessage: "This category",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisGiftCard: {
    id: "Yen5SP",
    defaultMessage: "This gift card",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisVoucher: {
    id: "2OUUkM",
    defaultMessage: "This voucher",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisDiscount: {
    id: "eaZlKB",
    defaultMessage: "This discount",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisModel: {
    id: "xOJd/Z",
    defaultMessage: "This model",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisModelType: {
    id: "vhhNHw",
    defaultMessage: "This model type",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisStructure: {
    id: "EgZF2U",
    defaultMessage: "This structure",
    description: "command palette section grouping actions for the currently open entity",
  },
  thisChannel: {
    id: "x+961a",
    defaultMessage: "This channel",
    description: "command palette section grouping actions for the currently open entity",
  },
  copied: {
    id: "eW3YG1",
    defaultMessage: "Copied to clipboard",
    description: "toast title after a command palette copy action succeeds",
  },
  copyFailed: {
    id: "x3lIH+",
    defaultMessage: "Could not copy to clipboard",
    description: "toast title after a command palette copy action fails",
  },
  copyOrderId: {
    id: "D1Vn6d",
    defaultMessage: "Copy order ID",
    description: "command palette action",
  },
  copyOrderNumber: {
    id: "X30QQ1",
    defaultMessage: "Copy order number",
    description: "command palette action",
  },
  copyDraftOrderId: {
    id: "i6MDjw",
    defaultMessage: "Copy draft order ID",
    description: "command palette action",
  },
  copyDraftOrderNumber: {
    id: "pmWI/7",
    defaultMessage: "Copy draft order number",
    description: "command palette action",
  },
  copyProductId: {
    id: "4TLDsf",
    defaultMessage: "Copy product ID",
    description: "command palette action",
  },
  copyVariantId: {
    id: "2qm57A",
    defaultMessage: "Copy variant ID",
    description: "command palette action",
  },
  copyCustomerId: {
    id: "FP306G",
    defaultMessage: "Copy customer ID",
    description: "command palette action",
  },
  copyCollectionId: {
    id: "pIgMKS",
    defaultMessage: "Copy collection ID",
    description: "command palette action",
  },
  copyCategoryId: {
    id: "TKfUiv",
    defaultMessage: "Copy category ID",
    description: "command palette action",
  },
  copyGiftCardId: {
    id: "XWTFlv",
    defaultMessage: "Copy gift card ID",
    description: "command palette action",
  },
  copyVoucherId: {
    id: "XdsQjm",
    defaultMessage: "Copy voucher ID",
    description: "command palette action",
  },
  copyDiscountId: {
    id: "A9HvZo",
    defaultMessage: "Copy discount ID",
    description: "command palette action",
  },
  copyModelId: {
    id: "swcabW",
    defaultMessage: "Copy model ID",
    description: "command palette action",
  },
  copyModelTypeId: {
    id: "uKf70f",
    defaultMessage: "Copy model type ID",
    description: "command palette action",
  },
  copyStructureId: {
    id: "uyEWze",
    defaultMessage: "Copy structure ID",
    description: "command palette action",
  },
  copyChannelId: {
    id: "yOEYnD",
    defaultMessage: "Copy channel ID",
    description: "command palette action",
  },
});

interface PageCopyLabels {
  section: MessageDescriptor;
  id: MessageDescriptor;
  number?: MessageDescriptor;
}

const PAGE_LABELS: Partial<Record<AppExtensionView, PageCopyLabels>> = {
  ORDER_DETAILS: {
    section: messages.thisOrder,
    id: messages.copyOrderId,
    number: messages.copyOrderNumber,
  },
  DRAFT_ORDER_DETAILS: {
    section: messages.thisDraftOrder,
    id: messages.copyDraftOrderId,
    number: messages.copyDraftOrderNumber,
  },
  PRODUCT_DETAILS: { section: messages.thisProduct, id: messages.copyProductId },
  CUSTOMER_DETAILS: { section: messages.thisCustomer, id: messages.copyCustomerId },
  COLLECTION_DETAILS: { section: messages.thisCollection, id: messages.copyCollectionId },
  CATEGORY_DETAILS: { section: messages.thisCategory, id: messages.copyCategoryId },
  GIFT_CARD_DETAILS: { section: messages.thisGiftCard, id: messages.copyGiftCardId },
  VOUCHER_DETAILS: { section: messages.thisVoucher, id: messages.copyVoucherId },
  DISCOUNT_DETAILS: { section: messages.thisDiscount, id: messages.copyDiscountId },
  PAGE_DETAILS: { section: messages.thisModel, id: messages.copyModelId },
  PAGE_TYPE_DETAILS: { section: messages.thisModelType, id: messages.copyModelTypeId },
  MENU_DETAILS: { section: messages.thisStructure, id: messages.copyStructureId },
  CHANNEL_DETAILS: { section: messages.thisChannel, id: messages.copyChannelId },
};

// The variant page is not an extension view; the extension resolver reads it as a product.
const VARIANT_VIEW = "PRODUCT_VARIANT_DETAILS";

interface CopyTarget {
  id: string;
  label: MessageDescriptor;
  value: string;
}

/**
 * Cmd+K "Copy … ID" actions for the entity open on the current page. IDs come from
 * the URL; order numbers and a variant's product ID are read from the Apollo cache,
 * so those actions appear only once the page query has loaded them.
 */
export const useCopyIdSearchActions = (): ContextualSearchAction[] => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const client = useApolloClient();
  const notify = useNotifier();
  const { trackEvent } = useAnalytics();

  const variantMatch = matchPath<{ variantId: string }>(pathname, {
    path: productVariantEditPath(":variantId"),
  });
  const context = resolveSearchActionContext(pathname);
  const view = variantMatch ? VARIANT_VIEW : context.view;
  const targets: CopyTarget[] = [];
  let section: MessageDescriptor | undefined;

  if (variantMatch) {
    section = messages.thisVariant;

    const variantId = decodeId(variantMatch.params.variantId);
    const variant = client.readFragment<ProductVariantProductIdFragment>({
      id: client.cache.identify({ __typename: "ProductVariant", id: variantId }),
      fragment: ProductVariantProductIdFragmentDoc,
    });

    targets.push({ id: "variant-id", label: messages.copyVariantId, value: variantId });

    if (variant) {
      targets.push({ id: "product-id", label: messages.copyProductId, value: variant.product.id });
    }
  } else if (context.view) {
    const labels = PAGE_LABELS[context.view];
    // Detail views resolve exactly one id param.
    const [id] = Object.values(context.params);

    if (labels && typeof id === "string") {
      section = labels.section;
      targets.push({ id: "id", label: labels.id, value: id });

      const order =
        labels.number &&
        client.readFragment<OrderNumberFragment>({
          id: client.cache.identify({ __typename: "Order", id }),
          fragment: OrderNumberFragmentDoc,
        });

      if (labels.number && order) {
        targets.push({ id: "number", label: labels.number, value: order.number });
      }
    }
  }

  if (!section) {
    return [];
  }

  const copy = (value: string): void => {
    if (view) {
      trackEvent("command_palette_copy_id", { view });
    }

    navigator.clipboard.writeText(value).then(
      () => notify({ status: "success", title: intl.formatMessage(messages.copied), text: value }),
      () => notify({ status: "error", title: intl.formatMessage(messages.copyFailed) }),
    );
  };

  const sectionLabel = intl.formatMessage(section);

  return targets.map(target => ({
    id: `copy-${target.id}`,
    label: intl.formatMessage(target.label),
    section: sectionLabel,
    aliases: ["id", "identifier", "clipboard"],
    onSelect: () => copy(target.value),
  }));
};

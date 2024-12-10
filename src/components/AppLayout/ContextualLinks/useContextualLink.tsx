import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import {
  API_GUIDE_DOCS,
  API_REFERENCE_DOCS,
  EXTENDING_WITH_WEBHOOKS_DOCS_URL,
  ORDER_MANAGEMENT_DOCS_URL,
  PRODUCT_CONFIGURATION_DOCS_URL,
  USER_PERMISSIONS_DOCS_URL,
} from "@dashboard/links";
import * as React from "react";
import { useIntl } from "react-intl";

import { ContextualLine } from "./ContextualLine";
import { contextualLinks } from "./messages";

type SubtitleType =
  | "extending_saleor"
  | "product_list"
  | "order_list"
  | "dev_panel"
  | "webhooks_events"
  | "staff_members";

const EVENT = "contextual_link_clicked";

export const useContextualLink = (type: SubtitleType) => {
  const { trackEvent: track } = useAnalytics();
  const intl = useIntl();
  const trackEvent = (type: string) => track(EVENT, { type });

  switch (type) {
    case "staff_members":
      return intl.formatMessage(contextualLinks.staffMembers, {
        userPermissions: (
          <ContextualLine.Link
            href={USER_PERMISSIONS_DOCS_URL}
            onClick={() => trackEvent("user_permissions_docs")}
          >
            {intl.formatMessage(contextualLinks.userPermissions)}
          </ContextualLine.Link>
        ),
      });
    case "extending_saleor":
      return intl.formatMessage(contextualLinks.webhooks, {
        extendingSaleor: (
          <ContextualLine.Link
            href={EXTENDING_WITH_WEBHOOKS_DOCS_URL}
            onClick={() => trackEvent("extending_saleor_docs")}
          >
            {intl.formatMessage(contextualLinks.extendingSaleor)}
          </ContextualLine.Link>
        ),
      });
    case "dev_panel":
      return intl.formatMessage(contextualLinks.devModePanel, {
        apiReference: (
          <ContextualLine.Link
            href={API_REFERENCE_DOCS}
            onClick={() => trackEvent("api_reference_docs")}
          >
            {intl.formatMessage(contextualLinks.apiReference)}
          </ContextualLine.Link>
        ),
        apiGuide: (
          <ContextualLine.Link href={API_GUIDE_DOCS} onClick={() => trackEvent("api_guide_docs")}>
            {intl.formatMessage(contextualLinks.apiGuide)}
          </ContextualLine.Link>
        ),
      });
    case "order_list":
      return intl.formatMessage(contextualLinks.orders, {
        orderManagement: (
          <ContextualLine.Link
            href={ORDER_MANAGEMENT_DOCS_URL}
            onClick={() => trackEvent("order_management_docs")}
          >
            {intl.formatMessage(contextualLinks.orderManagement)}
          </ContextualLine.Link>
        ),
      });
    case "product_list":
      return intl.formatMessage(contextualLinks.products, {
        productConfigurations: (
          <ContextualLine.Link
            href={PRODUCT_CONFIGURATION_DOCS_URL}
            onClick={() => trackEvent("product_configuration_docs")}
          >
            {intl.formatMessage(contextualLinks.productConfigurations)}
          </ContextualLine.Link>
        ),
      });
    default:
      return null;
  }
};

import {
  API_GUIDE_DOCS,
  API_REFERENCE_DOCS,
  EXTENDING_WITH_WEBHOOKS_DOCS_URL,
  ORDER_MANAGEMENT_DOCS_URL,
  PRODUCT_CONFIGURATION_DOCS_URL,
  USER_PERMISSIONS_DOCS_URL,
} from "@dashboard/links";
import * as React from "react";
import { IntlShape } from "react-intl";

import { ContextualLine } from "./ContextualLine";
import { contextualLinks } from "./messages";

type SubtitleType =
  | "extending_saleor"
  | "product_list"
  | "order_list"
  | "dev_panel"
  | "webhooks_events"
  | "staff_members";

export const getContextualSubtitle = (type: SubtitleType, intl: IntlShape) => {
  switch (type) {
    case "staff_members":
      return intl.formatMessage(contextualLinks.staffMembers, {
        userPermissions: (
          <ContextualLine.Link href={USER_PERMISSIONS_DOCS_URL}>
            {intl.formatMessage(contextualLinks.userPermissions)}
          </ContextualLine.Link>
        ),
      });
    case "extending_saleor":
      return intl.formatMessage(contextualLinks.webhooks, {
        extendingSaleor: (
          <ContextualLine.Link href={EXTENDING_WITH_WEBHOOKS_DOCS_URL}>
            {intl.formatMessage(contextualLinks.extendingSaleor)}
          </ContextualLine.Link>
        ),
      });
    case "dev_panel":
      return intl.formatMessage(contextualLinks.devModePanel, {
        apiReference: (
          <ContextualLine.Link href={API_REFERENCE_DOCS}>
            {intl.formatMessage(contextualLinks.apiReference)}
          </ContextualLine.Link>
        ),
        apiGuide: (
          <ContextualLine.Link href={API_GUIDE_DOCS}>
            {intl.formatMessage(contextualLinks.apiGuide)}
          </ContextualLine.Link>
        ),
      });
    case "order_list":
      return intl.formatMessage(contextualLinks.orders, {
        orderManagement: (
          <ContextualLine.Link href={ORDER_MANAGEMENT_DOCS_URL}>
            {intl.formatMessage(contextualLinks.orderManagement)}
          </ContextualLine.Link>
        ),
      });
    case "product_list":
      return intl.formatMessage(
        {
          defaultMessage: "Learn more about {configurationLink}",
          id: "/noPjR",
        },
        {
          configurationLink: (
            <ContextualLine.Link href={PRODUCT_CONFIGURATION_DOCS_URL}>
              {intl.formatMessage({
                defaultMessage: "product configurations",
                id: "dVk241",
              })}
            </ContextualLine.Link>
          ),
        },
      );
    default:
      return null;
  }
};

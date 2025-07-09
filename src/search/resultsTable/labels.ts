import {
  GlobalSearchQuery,
  OrderChargeStatusEnum,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { getStatusColor, transformChargedStatus, transformPaymentStatus } from "@dashboard/misc";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { DefaultTheme } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

export const getPaymentLabel = (
  intl: IntlShape,
  currentTheme: DefaultTheme,
  chargeStatus: OrderChargeStatusEnum,
  paymentStatus: PaymentChargeStatusEnum,
) => {
  if (chargeStatus === OrderChargeStatusEnum.OVERCHARGED) {
    const { localized, status } = transformChargedStatus(chargeStatus, intl);

    const color = getStatusColor({
      status,
      currentTheme,
    });

    return { color, localized };
  }

  const transformedPaymentStatus = transformPaymentStatus(paymentStatus, intl);

  const color = getStatusColor({
    status: transformedPaymentStatus.status,
    currentTheme,
  });

  return {
    color,
    localized: transformedPaymentStatus.localized,
  };
};

type CategoryNode = NonNullable<GlobalSearchQuery["categories"]>["edges"][number]["node"];

export const getCategoryHierarchyLabel = (choice: CategoryNode): string => {
  const { parent, level, ancestors } = choice;

  if (level === 0) {
    return "";
  }

  if (level === 1) {
    return `${parent?.name}` || "";
  }

  const ancestor = mapEdgesToItems(ancestors)?.[0];

  const parentLabel = parent?.name ?? null;
  const rootCategoryLabel = ancestor?.name || null;

  return `${rootCategoryLabel} ${level > 2 ? "/ ... /" : "/"} ${parentLabel}`;
};

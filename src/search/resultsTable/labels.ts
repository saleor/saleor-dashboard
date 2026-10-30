import { type GlobalSearchQuery } from "@dashboard/graphql";
import { getStatusColor, transformPaymentStatus } from "@dashboard/misc";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type DefaultTheme } from "@saleor/macaw-ui-next";
import { type IntlShape } from "react-intl";

type OrderNode = NonNullable<GlobalSearchQuery["orders"]>["edges"][number]["node"];

export const getPaymentLabel = (intl: IntlShape, currentTheme: DefaultTheme, order: OrderNode) => {
  const { localized, status } = transformPaymentStatus(order, intl);

  return { color: getStatusColor({ status, currentTheme }), localized };
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

import { attributePath } from "@dashboard/attributes/urls";
import { categoryPath } from "@dashboard/categories/urls";
import { channelPath } from "@dashboard/channels/urls";
import { collectionPath } from "@dashboard/collections/urls";
import { customerPath } from "@dashboard/customers/urls";
import { voucherPath } from "@dashboard/discounts/urls";
import { giftCardPath } from "@dashboard/giftCards/urls";
import { pagePath } from "@dashboard/modeling/urls";
import { orderPath } from "@dashboard/orders/urls";
import { productPath } from "@dashboard/products/urls";
import { productTypePath } from "@dashboard/productTypes/urls";
import { menuPath } from "@dashboard/structures/urls";
import { matchPath } from "react-router";

const locationsWithIdInContext = [
  channelPath(":id"),
  productPath(":id"),
  orderPath(":id"),
  categoryPath(":id"),
  collectionPath(":id"),
  voucherPath(":id"),
  // todo clean up when we clean extensions and apps in 3.22
  "/extensions/app/:id",
  attributePath(":id"),
  productTypePath(":id"),
  customerPath(":id"),
  giftCardPath(":id"),
  pagePath(":id"),
  menuPath(":id"),
];

/**
 * Takes locations with singular items, like Product Details or Order Details. Scan URLs and extract it's ID
 */
export const extractIdFromUrlContext = (): string | null => {
  const matchedPaths = locationsWithIdInContext
    .map(lookup =>
      matchPath(window.location.pathname, {
        path: lookup,
        exact: false,
        strict: false,
      }),
    )
    .filter(Boolean);

  const idInContext =
    matchedPaths.length > 0
      ? matchedPaths[0]!.params &&
        "id" in matchedPaths[0]!.params &&
        (matchedPaths[0]!.params.id as string)
      : null;

  return idInContext || null;
};

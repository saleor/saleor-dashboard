import { useVoucherAssignedIdsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";

/**
 * How many assigned ids to pull per catalogue list. The assign pickers only need these to hide
 * rows, so a cap is fine: beyond it exclusion goes partial and an already-assigned row can
 * reappear, which is recoverable (re-assigning it is a no-op) unlike an empty picker.
 */
const ASSIGNED_IDS_PAGE_SIZE = 100;

type IdPredicate = (item: { id: string }) => boolean;

interface VoucherAssignedIds {
  isProductAssigned: IdPredicate;
  isCategoryAssigned: IdPredicate;
  isCollectionAssigned: IdPredicate;
}

const toPredicate = (ids: string[] | undefined): IdPredicate => {
  const assigned = new Set(ids ?? []);

  return (item: { id: string }) => assigned.has(item.id);
};

/**
 * Complete-as-possible exclusion predicates for the voucher assign pickers.
 *
 * The details query paginates the voucher's own catalogue lists, so it only knows about the tab
 * page on screen — every assigned item beyond it would otherwise show up as assignable.
 * Fetched only while a picker is open, since nothing else needs it.
 */
export const useVoucherAssignedIds = ({
  id,
  skip,
}: {
  id: string;
  skip: boolean;
}): VoucherAssignedIds => {
  const { data } = useVoucherAssignedIdsQuery({
    variables: { id, first: ASSIGNED_IDS_PAGE_SIZE },
    skip,
    fetchPolicy: "cache-and-network",
  });

  const products = data?.voucher?.products;
  const categories = data?.voucher?.categories;
  const collections = data?.voucher?.collections;

  return {
    isProductAssigned: useMemo(
      () => toPredicate(mapEdgesToItems(products)?.map(product => product.id)),
      [products],
    ),
    isCategoryAssigned: useMemo(
      () => toPredicate(mapEdgesToItems(categories)?.map(category => category.id)),
      [categories],
    ),
    isCollectionAssigned: useMemo(
      () => toPredicate(mapEdgesToItems(collections)?.map(collection => collection.id)),
      [collections],
    ),
  };
};

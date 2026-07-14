import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { applyAttributeListFilters } from "@dashboard/attributes/utils/applyAttributeListFilters";
import { type AttributeFilterInput, type AttributeFragment } from "@dashboard/graphql";
import { type Sort } from "@dashboard/types";

const compareStrings = (left: string, right: string, direction: number): number =>
  left.localeCompare(right) * direction;

const compareBooleans = (left: boolean, right: boolean, direction: number): number =>
  (Number(left) - Number(right)) * direction;

export const filterAssignedAttributes = (
  attributes: AttributeFragment[],
  search: string | undefined,
  sort: Sort<AttributeListUrlSortField>,
  filters: AttributeFilterInput = {},
): AttributeFragment[] => {
  const trimmedSearch = search?.trim().toLowerCase() ?? "";
  const direction = sort.asc ? 1 : -1;

  const searched =
    trimmedSearch === ""
      ? [...attributes]
      : attributes.filter(
          attribute =>
            attribute.name.toLowerCase().includes(trimmedSearch) ||
            attribute.slug.toLowerCase().includes(trimmedSearch),
        );

  const filtered = applyAttributeListFilters(searched, filters);

  return filtered.sort((left, right) => {
    switch (sort.sort) {
      case AttributeListUrlSortField.slug:
        return compareStrings(left.slug, right.slug, direction);
      case AttributeListUrlSortField.visible:
        return compareBooleans(left.visibleInStorefront, right.visibleInStorefront, direction);
      case AttributeListUrlSortField.useInFacetedSearch:
        return compareBooleans(
          left.filterableInStorefront,
          right.filterableInStorefront,
          direction,
        );
      case AttributeListUrlSortField.name:
      default:
        return compareStrings(left.name, right.name, direction);
    }
  });
};

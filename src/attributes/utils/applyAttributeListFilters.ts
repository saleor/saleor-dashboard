import { type AttributeFilterInput } from "@dashboard/graphql";

interface AttributeListFilterableFields {
  visibleInStorefront: boolean;
  filterableInStorefront: boolean;
  filterableInDashboard: boolean;
  valueRequired?: boolean;
}

export const applyAttributeListFilters = <T extends AttributeListFilterableFields>(
  attributes: T[],
  filters: AttributeFilterInput,
): T[] =>
  attributes.filter(attribute => {
    if (
      filters.visibleInStorefront != null &&
      attribute.visibleInStorefront !== filters.visibleInStorefront
    ) {
      return false;
    }

    if (
      filters.filterableInStorefront != null &&
      attribute.filterableInStorefront !== filters.filterableInStorefront
    ) {
      return false;
    }

    if (
      filters.filterableInDashboard != null &&
      attribute.filterableInDashboard !== filters.filterableInDashboard
    ) {
      return false;
    }

    if (
      filters.valueRequired != null &&
      attribute.valueRequired !== undefined &&
      attribute.valueRequired !== filters.valueRequired
    ) {
      return false;
    }

    return true;
  });

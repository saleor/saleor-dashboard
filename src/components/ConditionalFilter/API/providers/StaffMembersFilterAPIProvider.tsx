import { StaffMemberStatus } from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { FilterAPIProvider } from "../../API/FilterAPIProvider";
import { EnumValuesHandler } from "../../API/Handler";
import { FilterContainer, FilterElement } from "../../FilterElement";

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

export const useStaffMembersFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();

  const fetchRightOptions = async (position: string, value: FilterContainer) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const rowType = filterElement.rowType();

    if (!rowType) {
      return [];
    }

    if (rowType === "staffMemberStatus") {
      return new EnumValuesHandler(StaffMemberStatus, "staffMemberStatus", intl).fetch();
    }

    return [];
  };

  const fetchAttributeOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};

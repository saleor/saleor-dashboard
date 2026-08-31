import { StaffMemberStatus } from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { type FilterAPIProvider } from "../../API/FilterAPIProvider";
import {
  emptyAttributeChoicesPage,
  emptyChoicesPage,
  fetchHandlerPage,
} from "../../API/filterChoicesPage";
import { EnumValuesHandler } from "../../API/Handler";
import { type FilterContainer, type FilterElement } from "../../FilterElement";

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

export const useStaffMembersFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    _inputValue?: string,
    after?: string | null,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const rowType = filterElement.rowType();

    if (!rowType) {
      return emptyChoicesPage();
    }

    if (rowType === "staffMemberStatus") {
      return fetchHandlerPage(
        new EnumValuesHandler(StaffMemberStatus, "staffMemberStatus", intl),
        after,
      );
    }

    return emptyChoicesPage();
  };

  const fetchAttributeOptions = async () => {
    return emptyAttributeChoicesPage();
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};

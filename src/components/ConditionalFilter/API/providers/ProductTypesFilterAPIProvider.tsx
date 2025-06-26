import {
  BooleanValuesHandler,
  EnumValuesHandler,
} from "@dashboard/components/ConditionalFilter/API/Handler";
import { ProductTypeEnum } from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { FilterContainer } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import { getFilterElement } from "../utils";

export const useProductTypesFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();

  const fetchRightOptions = async (position: string, value: FilterContainer) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);
    const rowType = filterElement.rowType();

    if (rowType === "configurable") {
      return await new BooleanValuesHandler([
        {
          label: "Yes",
          value: "true",
          type: rowType,
          slug: "true",
        },
        {
          label: "No",
          value: "false",
          type: rowType,
          slug: "false",
        },
      ]).fetch();
    }

    if (rowType === "typeOfProduct") {
      return await new EnumValuesHandler(ProductTypeEnum, "typeOfProduct", intl).fetch();
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

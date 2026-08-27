import {
  BooleanValuesHandler,
  EnumValuesHandler,
} from "@dashboard/components/ConditionalFilter/API/Handler";
import { ProductTypeEnum } from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { type FilterContainer } from "../../FilterElement";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import {
  emptyAttributeChoicesPage,
  emptyChoicesPage,
  fetchHandlerPage,
} from "../filterChoicesPage";
import { getFilterElement } from "../utils";

export const useProductTypesFilterAPIProvider = (): FilterAPIProvider => {
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

    if (rowType === "configurable") {
      return fetchHandlerPage(
        new BooleanValuesHandler([
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
        ]),
        after,
      );
    }

    if (rowType === "typeOfProduct") {
      return fetchHandlerPage(new EnumValuesHandler(ProductTypeEnum, "typeOfProduct", intl), after);
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

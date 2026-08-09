import { DiscountStatusEnum, PromotionTypeEnum } from "@dashboard/graphql";
import { type IntlShape, useIntl } from "react-intl";

import { type FilterContainer, type FilterElement } from "../../FilterElement";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { EnumValuesHandler, type Handler } from "../Handler";
import { getFilterElement } from "../utils";

const createAPIHandler = (selectedRow: FilterElement, intl: IntlShape): Handler | null => {
  const rowType = selectedRow.rowType();

  if (rowType === "promotionStatus") {
    return new EnumValuesHandler(DiscountStatusEnum, "promotionStatus", intl);
  }

  if (rowType === "promotionType") {
    return new EnumValuesHandler(PromotionTypeEnum, "promotionType", intl);
  }

  return null;
};

export const useDiscountFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    _inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);
    const handler = createAPIHandler(filterElement, intl);

    if (!handler) {
      return [];
    }

    return handler.fetch();
  };

  const fetchAttributeOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};

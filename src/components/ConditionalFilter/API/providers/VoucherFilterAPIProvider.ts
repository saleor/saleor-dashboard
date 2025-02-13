import { ApolloClient, useApolloClient } from "@apollo/client";
import {
  ChannelHandler,
  EnumValuesHandler,
  Handler,
} from "@dashboard/components/ConditionalFilter/API/Handler";
import {
  FilterContainer,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement";
import { DiscountStatusEnum, VoucherDiscountType } from "@dashboard/graphql";
import { IntlShape, useIntl } from "react-intl";

import { FilterAPIProvider } from "../FilterAPIProvider";

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
  intl: IntlShape,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType === "channel") {
    return new ChannelHandler(client, inputValue);
  }

  if (rowType === "discountType") {
    return new EnumValuesHandler(VoucherDiscountType, "discountType", intl);
  }

  if (rowType === "voucherStatus") {
    return new EnumValuesHandler(DiscountStatusEnum, "voucherStatus", intl);
  }

  throw new Error(`Unknown filter element: "${rowType}"`);
};

export const useVoucherAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement, client, inputValue, intl);

    return handler.fetch();
  };

  const fetchLeftOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
  };
};

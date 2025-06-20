import { ApolloClient, useApolloClient } from "@apollo/client";
import { DiscountStatusEnum, VoucherDiscountType } from "@dashboard/graphql";
import { IntlShape, useIntl } from "react-intl";

import { FilterContainer, FilterElement } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import { ChannelHandler, EnumValuesHandler, Handler } from "../Handler";
import { getFilterElement } from "../utils";

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

  const fetchAttributeOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};

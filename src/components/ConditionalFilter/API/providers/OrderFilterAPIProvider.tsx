import { ApolloClient, useApolloClient } from "@apollo/client";
import {
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { IntlShape, useIntl } from "react-intl";

import { RowType } from "../../constants";
import { FilterContainer, FilterElement } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import {
  BooleanValuesHandler,
  EnumValuesHandler,
  Handler,
  LegacyChannelHandler,
  NoopValuesHandler,
  TextInputValuesHandler,
} from "../Handler";
import { getFilterElement } from "../utils";

const isStaticBoolean = (rowType: RowType) => {
  return ["isClickAndCollect", "isPreorder", "giftCardUsed", "giftCardBought"].includes(rowType);
};

const createAPIHandler = (
  selectedRow: FilterElement,
  inputValue: string,
  intl: IntlShape,
  client: ApolloClient<unknown>,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType && isStaticBoolean(rowType) && rowType !== "attribute") {
    return new BooleanValuesHandler([
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
    ]);
  }

  if (rowType === "paymentStatus") {
    return new EnumValuesHandler(PaymentChargeStatusEnum, rowType, intl);
  }

  if (rowType === "status") {
    return new EnumValuesHandler(OrderStatusFilter, rowType, intl);
  }

  if (rowType === "authorizeStatus") {
    return new EnumValuesHandler(OrderAuthorizeStatusEnum, rowType, intl);
  }

  if (rowType === "chargeStatus") {
    return new EnumValuesHandler(OrderChargeStatusEnum, rowType, intl);
  }

  if (rowType === "channels") {
    return new LegacyChannelHandler(client, inputValue);
  }

  if (rowType === "customer") {
    return new TextInputValuesHandler([
      {
        label: "Customer",
        value: selectedRow.condition.selected.value as string,
        type: "customer",
        slug: "customer",
      },
    ]);
  }

  if (rowType === "ids") {
    return new NoopValuesHandler([]);
  }

  if (rowType === "metadata") {
    return new NoopValuesHandler([]);
  }

  throw new Error(`Unknown filter element: "${rowType}"`);
};

export const useOrderFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement, inputValue, intl, client);

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

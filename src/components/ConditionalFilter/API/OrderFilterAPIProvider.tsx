import { ApolloClient, useApolloClient } from "@apollo/client";
import { FilterAPIProvider } from "@dashboard/components/ConditionalFilter/API/FilterAPIProvider";
import {
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { IntlShape, useIntl } from "react-intl";

import { RowType } from "../constants";
import { FilterContainer, FilterElement } from "../FilterElement";
import {
  BooleanValuesHandler,
  EnumValuesHandler,
  Handler,
  LegacyChannelHandler,
  TextInputValuesHandler,
} from "./Handler";

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

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

  const fetchLeftOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
  };
};
